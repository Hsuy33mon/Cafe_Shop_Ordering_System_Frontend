// src/utils/thermalPrint.ts
import qz from 'qz-tray'

export async function printInvoiceThermal(invoice: any) {
  try {
    // dev-only (works if QZ Tray allows unsigned)
    qz.security.setCertificatePromise(() => Promise.resolve(null))
    qz.security.setSignaturePromise(() => Promise.resolve(null))

    if (!qz.websocket.isActive()) {
      await qz.websocket.connect()
    }

    const printer = await qz.printers.getDefault()
    const config = qz.configs.create(printer, { copies: 1, encoding: 'UTF-8' })

    const lines: string[] = [
      '\x1B\x40',
      '\x1B\x61\x01',
      'Cafe Shop\n',
      '\x1B\x61\x00',
      '------------------------------\n',
      `Invoice #${invoice.id}\n`,
      `Customer: ${invoice.customerName ?? '-'}\n`,
      `Date: ${new Date().toLocaleString()}\n`,
      '------------------------------\n',
    ]

    ;(invoice.orders ?? []).forEach((it: any) => {
      lines.push(`${it.menuItemName} (${it.sizeName})\n`)
      lines.push(
        `${it.qty} x ${Number(it.unitPrice).toFixed(2)} = ${Number(it.lineTotal).toFixed(2)}\n`,
      )
      if (it.note) lines.push(`Note: ${it.note}\n`)
      lines.push('------------------------------\n')
    })

    lines.push(`TOTAL: ${Number(invoice.grandTotal ?? 0).toFixed(2)}\n`)
    lines.push('\n\n\n\n')

    await qz.print(config, lines)
  } catch (e) {
    console.error('printInvoiceThermal error:', e)
  }
}