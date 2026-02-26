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
          <option value="Cafe">Cafe</option>
          <option value="Room">Room</option>
          <option value="Take-away">Take-away</option>
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

      <template #cell-invoicePaymentStatus="{ value }">
        <span class="status-pill">{{ value }}</span>
      </template>

      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <template #cell-actions="{ row }">
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

/* =======================
   Store + Route
======================= */
const route = useRoute()
const ordersStore = useOrdersStore()
const wsStore = useWsStore()

const tableNoFilter = computed<string | null>(() => {
  const v = route.query.tableNo
  return typeof v === 'string' ? v : null
})

/* =======================
   Websocket banner state
======================= */
const showLatestOnly = ref(false)

const hasNewOrders = computed(() => wsStore.hasNewOrders)
const newOrderCount = computed(() => wsStore.newOrderCount)

/* =======================
   Fetch + connect websocket
======================= */
onMounted(async () => {
  await ordersStore.fetchAll()
  wsStore.connect()
})

onUnmounted(() => {
  // If you want websocket to remain app-wide, remove this:
  // wsStore.disconnect()
})

/* When websocket ids change, refresh table data */
watch(
  () => wsStore.newOrderIds,
  async (ids) => {
    if (ids.length) {
      await ordersStore.fetchAll()
    }
  },
  { deep: true },
)

/* =======================
   Types
======================= */
type Channel = 'Cafe' | 'Room' | 'Take-away'
type InvoicePaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'EXPIRED' | 'REFUNDED'

type OrderRow = {
  id: number
  orderPlaceId: number | null
  orderPlaceNo: string
  tableNo: string | null
  date: string
  time: string
  customerName: string
  channel: Channel
  itemsSummary: string
  total: number
  invoicePaymentStatus: InvoicePaymentStatus
  status: OrderStatus
}

/* =======================
   Table Columns
======================= */
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

/* =======================
   Filters
======================= */
const search = ref('')
const statusFilter = ref('')
const channelFilter = ref('')
const paymentFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

/* =======================
   Map backend -> table rows
======================= */
const orders = computed<OrderRow[]>(() =>
  ordersStore.items.map((o: any) => {
    const customerName =
      o.customerName ??
      o.customer?.name ??
      o.order?.customerName ??
      o.items?.[0]?.customerName ??
      '-'

    const orderPlaceNo = o.orderPlace?.no ?? o.orderPlaceNo ?? o.tableNo ?? '-'

    return {
      id: Number(o.id),
      orderPlaceId: o.orderPlaceId ?? null,
      orderPlaceNo,
      tableNo: o.tableNo ?? null,
      date: o.date,
      time: o.time,
      customerName,
      channel: o.channel,
      itemsSummary: (o.items ?? []).map((i: any) => `${i.quantity}× ${i.name}`).join(', '),
      total: o.total ?? 0,
      invoicePaymentStatus: o.invoicePaymentStatus,
      status: o.status,
    }
  }),
)

/* =======================
   Filtered Orders
   - supports: websocket "latest only"
======================= */
const filteredOrders = computed(() => {
  const s = search.value.trim().toLowerCase()
  const start = startDateFilter.value
  const end = endDateFilter.value
  const latestSet = wsStore.newOrderIdSet

  return orders.value.filter((o) => {
    // ✅ show only websocket orders
    if (showLatestOnly.value && !latestSet.has(o.id)) return false

    const matchesSearch =
      !s ||
      String(o.id).includes(s) ||
      o.customerName.toLowerCase().includes(s) ||
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
})

/* =======================
   Banner actions
======================= */
async function onViewLatest() {
  showLatestOnly.value = true
  await ordersStore.fetchAll()
}

function onShowAll() {
  showLatestOnly.value = false
  // optional: clear the banner when you go back to all
  // wsStore.clearNewOrders()
}

/* =======================
   Status UI helper
======================= */
function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'PENDING',
    'status-pill--prep': status === 'PREPARING',
    'status-pill--ready': status === 'READY',
    'status-pill--paid': status === 'COMPLETED',
    'status-pill--cancel': status === 'CANCELLED',
  }
}

/* =======================
   Dialog (optional)
======================= */
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

function openStatusDialog(order: OrderRow) {
  statusTarget.value = order
  statusToUpdate.value = order.status
  statusDialogVisible.value = true
}

function closeStatusDialog() {
  statusDialogVisible.value = false
  statusTarget.value = null
}

async function confirmStatusUpdate() {
  if (!statusTarget.value) return
  await ordersStore.update(statusTarget.value.id, { status: statusToUpdate.value })
  statusDialogVisible.value = false
}

/* =======================
   Cancel order
======================= */
async function cancelOrder(order: OrderRow) {
  if (order.status === 'CONFIRMED') return
  await ordersStore.update(order.id, { status: 'CANCELLED' })
}
function onClearNoti() {
  wsStore.clearNewOrders()
  showLatestOnly.value = false
}
</script>

<style scoped src="@/styles/admin/orders.css"></style>
