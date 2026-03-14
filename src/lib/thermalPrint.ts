import qz from 'qz-tray'

export type ReceiptItem = {
  name: string
  qty: number
  basePrice: number
  ingredientPrice: number
  price: number
  ingredients?: Array<{
    name: string
    qty: number
    price: number
  }>
}

export type ReceiptData = {
  shopName: string
  address?: string
  phone?: string
  orderNo?: string | number
  customerName?: string
  orderType?: string
  place?: string
  method?: string
  status?: string
  items: ReceiptItem[]
  subtotal: number
  total: number
}

let qzInitialized = false

const RECEIPT_WIDTH = 32

function money(v: number) {
  return `${Number(v || 0).toFixed(0)}`
}

function safeText(value: string, max = RECEIPT_WIDTH) {
  const s = String(value ?? '')
  return s.length > max ? s.slice(0, max) : s
}

function padRight(value: string, len: number) {
  const text = String(value ?? '')
  return text.length >= len ? text.slice(0, len) : text + ' '.repeat(len - text.length)
}

function line(left = '', right = '', width = RECEIPT_WIDTH) {
  const leftText = String(left ?? '')
  const rightText = String(right ?? '')

  if (leftText.length + rightText.length >= width) {
    return `${leftText.slice(0, Math.max(0, width - rightText.length - 1))} ${rightText}`
  }

  const leftWidth = Math.max(0, width - rightText.length)
  return padRight(leftText, leftWidth) + rightText
}

function center(text: string, width = RECEIPT_WIDTH) {
  const t = safeText(text, width)
  const left = Math.max(0, Math.floor((width - t.length) / 2))
  return ' '.repeat(left) + t
}

function separator(width = RECEIPT_WIDTH) {
  return '-'.repeat(width)
}

function buildEscPosReceipt(data: ReceiptData) {
  const out: string[] = []

  out.push('\x1B\x40') // init

  // Header
  out.push('\x1B\x61\x01') // center
  out.push(safeText(data.shopName, RECEIPT_WIDTH))
  if (data.address) out.push(safeText(data.address, RECEIPT_WIDTH))
  if (data.phone) out.push(safeText(data.phone, RECEIPT_WIDTH))
  out.push('')

  // Meta
  out.push('\x1B\x61\x00') // left
  out.push(separator())
  if (data.orderNo != null) out.push(line('Order No', String(data.orderNo)))
  if (data.customerName) out.push(line('Customer', data.customerName))
  if (data.orderType) out.push(line('Type', data.orderType))
  if (data.place) out.push(line('Place', data.place))
  if (data.method) out.push(line('Method', data.method))
  if (data.status) out.push(line('Status', data.status))
  out.push(line('Printed', new Date().toLocaleString()))
  out.push(separator())

  // Items
  data.items.forEach((item) => {
    const itemName = safeText(item.name, RECEIPT_WIDTH)
    const amount = money(item.qty * item.price)

    out.push(itemName)
    out.push(line(`${item.qty} x ${money(item.price)}`, amount))

    // show product vs ingredient separately
    out.push(line('  Product', money(item.basePrice)))
    out.push(line('  Ingredient', money(item.ingredientPrice)))

    // optional ingredient detail lines
    if (Array.isArray(item.ingredients) && item.ingredients.length > 0) {
      item.ingredients.forEach((ing) => {
        const ingName = safeText(`  + ${ing.name}`, RECEIPT_WIDTH - 8)
        const ingAmount = money(Number(ing.price || 0) * Number(ing.qty || 0))
        out.push(line(ingName, ingAmount))
      })
    }

    out.push('')
  })

  out.push(separator())
  out.push(line('Subtotal', money(data.subtotal)))
  out.push(line('Total', money(data.total)))
  out.push(separator())

  out.push('\x1B\x61\x01') // center
  out.push(center('Thank you'))
  out.push(center('Please come again'))
  out.push('')
  out.push('')
  out.push('')

  out.push('\x1D\x56\x00') // cut

  return out.join('\n')
}

function getBackendBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL as string)?.replace(/\/$/, '') || ''
}

function initQzSecurity() {
  if (qzInitialized) return

  const baseUrl = getBackendBaseUrl()

  qz.security.setCertificatePromise((resolve, reject) => {
    fetch(`${baseUrl}/api/qz/certificate`, {
      method: 'GET',
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Certificate request failed: ${res.status}`)
        }
        resolve(await res.text())
      })
      .catch((err) => {
        console.error('QZ certificate load failed:', err)
        reject(err)
      })
  })

  qz.security.setSignatureAlgorithm('SHA512')

  qz.security.setSignaturePromise((toSign) => {
    return (resolve, reject) => {
      fetch(`${baseUrl}/api/qz/sign`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: toSign,
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Signature request failed: ${res.status}`)
          }
          resolve(await res.text())
        })
        .catch((err) => {
          console.error('QZ signature load failed:', err)
          reject(err)
        })
    }
  })

  qz.websocket.setErrorCallbacks((err) => {
    console.error('QZ websocket error:', err)
  })

  qz.websocket.setClosedCallbacks((evt) => {
    console.warn('QZ websocket closed:', evt)
  })

  qzInitialized = true
}

async function ensureQzConnection() {
  initQzSecurity()

  if (!qz.websocket.isActive()) {
    await qz.websocket.connect({
      host: ['localhost', 'localhost.qz.io'],
      port: {
        secure: [8181, 8282, 8383, 8484],
        insecure: [8182, 8283, 8384, 8485],
      },
      retries: 2,
      delay: 1,
    })
  }
}

export async function findAvailablePrinters() {
  await ensureQzConnection()
  return qz.printers.find()
}

export async function printDirectThermalReceipt(printerName: string, data: ReceiptData) {
  await ensureQzConnection()

  if (!printerName || !printerName.trim()) {
    throw new Error('Printer name is empty')
  }

  const config = qz.configs.create(printerName.trim(), {
    copies: 1,
    encoding: 'CP437',
  })

  const receipt = buildEscPosReceipt(data)

  await qz.print(config, [
    {
      type: 'raw',
      format: 'command',
      data: receipt,
    },
  ])
}
