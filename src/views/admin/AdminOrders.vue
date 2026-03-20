<template>
  <main class="content">
    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <!-- SEARCH -->
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by order #, customer, room, items…"
        />

        <!-- DATE RANGE -->
        <div class="date-range">
          <input v-model="startDateFilter" type="date" class="date-input" aria-label="Start date" />
          <span class="date-separator">–</span>
          <input v-model="endDateFilter" type="date" class="date-input" aria-label="End date" />
        </div>

        <!-- STATUS -->
        <select v-model="statusFilter" class="filter-select">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PREPARING">Preparing</option>
          <option value="READY">Ready</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <!-- CHANNEL -->
        <select v-model="channelFilter" class="filter-select">
          <option value="">All channels</option>
          <option value="TABLE">Table</option>
          <option value="ROOM">Room</option>
        </select>

        <!-- PAYMENT (match backend enum) -->
        <select v-model="paymentFilter" class="filter-select">
          <option value="">All payments</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELED">Canceled</option>
          <option value="EXPIRED">Expired</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>
    </section>

    <!-- NEW ORDERS BANNER (from websocket) -->
    <div class="orders-new-banner" v-if="hasNewOrders">
      <div class="orders-new-left">
        <span class="orders-new-dot"></span>
        <span class="orders-new-text">
          {{ newOrderCount }} new order{{ newOrderCount > 1 ? 's' : '' }} just arrived
        </span>
      </div>

      <div style="display: flex; gap: 10px">
        <button class="orders-new-btn" @click="onViewLatest">View latest</button>

        <button v-if="showLatestOnly" class="orders-new-btn" @click="onShowAll">Show all</button>

        <button class="orders-new-btn" @click="onClearNoti">Clear</button>
      </div>
    </div>

    <!-- ORDERS TABLE -->
    <AdminTable :columns="orderColumns" :rows="filteredOrders" title="All orders" :page-size="20">
      <template #cell-details="{ row }">
        <RouterLink :to="{ name: 'admin-order-details', params: { id: row.id } }" class="btn-link">
          Details
        </RouterLink>
      </template>
      <template #cell-channel="{ value }">
        <span class="status-pill status-pill--channel">
          {{ value === 'ROOM' ? 'Room' : 'Table' }}
        </span>
      </template>

      <template #cell-invoicePaymentStatus="{ value }">
        <span class="status-pill">{{ value }}</span>
      </template>

      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <template #cell-actions="{ row }">
         <button class="btn-link" @click="openStatusDialog(row)">Update</button>

        <button class="btn-link btn-link--danger" @click="cancelOrder(row)">Cancel</button>
      </template>
    </AdminTable>

    <!-- STATUS UPDATE DIALOG -->
    <div v-if="statusDialogVisible" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">Update status · Order #{{ statusTarget?.id }}</h3>

        <p class="modal-text">
          Current status:
          <strong>{{ statusTarget?.status }}</strong>
        </p>

        <label class="modal-label">
          New status
          <select v-model="statusToUpdate" class="modal-select">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>

        <div class="modal-actions">
          <button class="modal-btn modal-btn--primary" @click="confirmStatusUpdate">Update</button>
          <button class="modal-btn" @click="closeStatusDialog">Cancel</button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useOrdersStore, type OrderStatus } from '@/stores/useOrderStore'
import { useWsStore } from '@/stores/useWsStore'
import { useRoute } from 'vue-router'
import { printDirectThermalReceipt, type ReceiptData, type ReceiptItem } from '@/lib/thermalPrint'

const route = useRoute()
const ordersStore = useOrdersStore()
const wsStore = useWsStore()

const tableNoFilter = computed<string | null>(() => {
  const v = route.query.tableNo
  return typeof v === 'string' ? v : null
})

const showLatestOnly = ref(false)

const hasNewOrders = computed(() => wsStore.hasNewOrders)
const newOrderCount = computed(() => wsStore.newOrderCount)

const printedInvoiceIds = ref<Set<number>>(new Set())

onMounted(async () => {
  localStorage.setItem('selectedPrinter', 'ZN- ZN58U')
  await ordersStore.fetchAll()
  wsStore.connect()
})

onUnmounted(() => {
  // wsStore.disconnect()
})

type channel = 'TABLE' | 'ROOM'
type InvoicePaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'EXPIRED' | 'REFUNDED'

type OrderRow = {
  id: number
  invoiceId: number | null
  orderPlaceId: number | null
  orderPlaceNo: string
  tableNo: string | null
  date: string
  time: string
  customerName: string
  channel: channel
  itemsSummary: string
  total: number
  invoicePaymentStatus: InvoicePaymentStatus
  status: OrderStatus
}

const orderColumns: TableColumn[] = [
  { key: 'id', label: '#', width: '70px', align: 'left' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'orderPlaceNo', label: 'Order Place' },
  { key: 'customerName', label: 'Customer' },
  { key: 'channel', label: 'Channel' },
  { key: 'itemsSummary', label: 'Items' },
  { key: 'total', label: 'Total (฿)', align: 'right' },
  { key: 'invoicePaymentStatus', label: 'Payment' },
  { key: 'status', label: 'Status' },
  { key: 'details', label: '', align: 'right' },
  { key: 'actions', label: '', align: 'right' },
]

const search = ref('')
const statusFilter = ref('')
const channelFilter = ref('')
const paymentFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

function buildItemSummary(order: any) {
  const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null
  if (!firstItem) return '-'

  const sizeText = firstItem.size ? ` (${firstItem.size})` : ''
  const qty = Number(firstItem.quantity ?? 0)

  return `${qty}x ${firstItem.name ?? '-'}${sizeText}`
}
function playNewOrderBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext

    if (!AudioContextClass) return

    const audioCtx = new AudioContextClass()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // high beep
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.15)

    oscillator.onended = () => {
      audioCtx.close()
    }
  } catch (error) {
    console.warn('Beep failed:', error)
  }
}

const orders = computed<OrderRow[]>(() =>
  ordersStore.items.map((o: any) => ({
    id: Number(o.id),
    invoiceId: o.invoiceId != null ? Number(o.invoiceId) : null,
    orderPlaceId: o.orderPlaceId != null ? Number(o.orderPlaceId) : null,
    orderPlaceNo: o.tableNo ?? '-',
    tableNo: o.tableNo ?? null,
    date: o.date ?? '',
    time: o.time ?? '',
    customerName: o.customerName ?? '-',
    channel: (o.channel ?? 'TABLE') as channel,
    itemsSummary: buildItemSummary(o),
    total: Number(o.total ?? 0),
    invoicePaymentStatus: (o.invoicePaymentStatus ?? 'PENDING') as InvoicePaymentStatus,
    status: o.status,
  })),
)

const filteredOrders = computed(() => {
  const s = search.value.trim().toLowerCase()
  const start = startDateFilter.value
  const end = endDateFilter.value
  const latestSet = wsStore.newOrderIdSet

  return orders.value
    .filter((o) => {
      if (showLatestOnly.value && !latestSet.has(o.id)) return false

      const matchesSearch =
        !s ||
        String(o.id).includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.orderPlaceNo.toLowerCase().includes(s) ||
        o.itemsSummary.toLowerCase().includes(s)

      const matchesStatus = !statusFilter.value || o.status === statusFilter.value
      const matchesChannel = !channelFilter.value || o.channel === channelFilter.value
      const matchesPayment = !paymentFilter.value || o.invoicePaymentStatus === paymentFilter.value
      const matchesTable = !tableNoFilter.value || o.tableNo === tableNoFilter.value

      let matchesDate = true
      if (start && end) matchesDate = o.date >= start && o.date <= end
      else if (start) matchesDate = o.date >= start
      else if (end) matchesDate = o.date <= end

      return (
        matchesSearch &&
        matchesStatus &&
        matchesChannel &&
        matchesPayment &&
        matchesTable &&
        matchesDate
      )
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime()
      const dateB = new Date(`${b.date} ${b.time}`).getTime()

      return dateB - dateA // ✅ newest first
    })
})

function getSelectedPrinterName() {
  return localStorage.getItem('selectedPrinter') || 'ZN- ZN58U'
}

function buildReceiptFromInvoiceOrders(invoiceId: number): ReceiptData | null {
  const invoiceOrders = ordersStore.items.filter(
    (o: any) => Number(o.invoiceId) === Number(invoiceId),
  )
  if (!invoiceOrders.length) return null

  const first = invoiceOrders[0]
  const receiptItems: ReceiptItem[] = invoiceOrders.flatMap((order: any) => {
    const orderItems = Array.isArray(order.items) ? order.items : []

    return orderItems.map((item: any) => {
      const qty = Number(item.quantity ?? 0)
      const ingredientList = Array.isArray(item.orderIngredients) ? item.orderIngredients : []

      const ingredientUnitPrice = ingredientList.reduce(
        (sum: number, ing: any) => sum + Number(ing.price ?? 0) * Number(ing.qty ?? 0),
        0,
      )

      const lineIngredientPrice = ingredientUnitPrice * qty
      const unitPrice = Number(item.unitPrice ?? 0)
      const baseUnitPrice = Math.max(0, unitPrice - ingredientUnitPrice)
      const lineBasePrice = baseUnitPrice * qty

      return {
        name: `${item.name ?? '-'}${item.size ? ` (${item.size})` : ''}`,
        qty,
        basePrice: lineBasePrice,
        ingredientPrice: lineIngredientPrice,
        price: unitPrice,
        ingredients: ingredientList.map((ing: any) => ({
          name: ing.ingredientName ?? '-',
          qty: Number(ing.qty ?? 0),
          price: Number(ing.price ?? 0),
        })),
      }
    })
  })

  if (!receiptItems.length) return null

  const subtotal = receiptItems.reduce((sum, item) => sum + item.basePrice, 0)
  const ingredientTotal = receiptItems.reduce((sum, item) => sum + item.ingredientPrice, 0)
  const total = subtotal + ingredientTotal

  return {
    shopName: '5:1',
    address: '25, D Varee Residence Montara',
    phone: '+66 08 319 36982',
    orderNo: invoiceId,
    customerName: first.customerName ?? '-',
    orderType: first.channel ?? '-',
    place: first.tableNo ?? '-',
    method: first.invoicePaymentStatus ?? '-',
    status: first.status ?? '-',
    items: receiptItems,
    subtotal,
    ingredientTotal,
    total,
  }
}
async function autoPrintInvoiceByOrderId(orderId: number) {
  try {
    const printerName = getSelectedPrinterName()

    if (!printerName || !printerName.trim()) {
      console.warn('No selected printer. Skip auto print.')
      return
    }

    const targetOrder = ordersStore.items.find((o: any) => Number(o.id) === Number(orderId))
    if (!targetOrder) {
      console.warn(`Order not found for id=${orderId}`)
      return
    }

    const invoiceId = targetOrder.invoiceId != null ? Number(targetOrder.invoiceId) : null
    if (!invoiceId) {
      console.warn(`Order ${orderId} has no invoiceId`)
      return
    }

    if (printedInvoiceIds.value.has(invoiceId)) {
      console.log(`Invoice ${invoiceId} already printed`)
      return
    }

    const receipt = buildReceiptFromInvoiceOrders(invoiceId)
    if (!receipt) {
      console.warn(`Cannot build receipt for invoice ${invoiceId}`)
      return
    }

    await printDirectThermalReceipt(printerName, receipt)
    printedInvoiceIds.value.add(invoiceId)

    console.log(`Invoice ${invoiceId} printed successfully`)
  } catch (error) {
    console.error('Auto print failed:', error)
  }
}

watch(
  () => [...wsStore.newOrderIds],
  async (newIds, oldIds = []) => {
    const oldSet = new Set(oldIds)
    const trulyNewIds = newIds.filter((id) => !oldSet.has(id))

    if (!trulyNewIds.length) return

    await ordersStore.fetchAll()
    playNewOrderBeep()

    for (const orderId of trulyNewIds) {
      await autoPrintInvoiceByOrderId(orderId)
    }
  },
  { deep: true },
)

async function onViewLatest() {
  showLatestOnly.value = true
  await ordersStore.fetchAll()
}

function onShowAll() {
  showLatestOnly.value = false
}

function onClearNoti() {
  wsStore.clearNewOrders()
  showLatestOnly.value = false
}

function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'PENDING',
    'status-pill--prep': status === 'PREPARING',
    'status-pill--ready': status === 'READY',
    'status-pill--paid': status === 'COMPLETED',
    'status-pill--cancel': status === 'CANCELLED',
  }
}

const statusDialogVisible = ref(false)
const statusTarget = ref<OrderRow | null>(null)
const statusToUpdate = ref<OrderStatus>('PENDING')

const statusOptions: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'COMPLETED',
  'CANCELLED',
]

function closeStatusDialog() {
  statusDialogVisible.value = false
  statusTarget.value = null
}

// async function confirmStatusUpdate() {
//   if (!statusTarget.value) return
//   await ordersStore.update(statusTarget.value.id, { status: statusToUpdate.value })
//   statusDialogVisible.value = false
//   statusTarget.value = null
// }

async function cancelOrder(order: OrderRow) {
  if (order.status === 'CONFIRMED') return
  await ordersStore.update(order.id, { status: 'CANCELLED' })
}

function openStatusDialog(order: OrderRow) {
  statusTarget.value = order
  statusToUpdate.value = order.status // preload current status
  statusDialogVisible.value = true
}

async function confirmStatusUpdate() {
  if (!statusTarget.value) return

  await ordersStore.update(statusTarget.value.id, {
    status: statusToUpdate.value,
  })

  await ordersStore.fetchAll() // ✅ ADD THIS

  closeStatusDialog()
}
</script>
<style scoped src="@/styles/admin/orders.css"></style>
