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
          <option value="New">New</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>

        <!-- CHANNEL -->
        <select v-model="channelFilter" class="filter-select">
          <option value="">All channels</option>
          <option value="Cafe">Cafe</option>
          <option value="Room">Room</option>
          <option value="Take-away">Take-away</option>
        </select>

        <!-- PAYMENT -->
        <select v-model="paymentFilter" class="filter-select">
          <option value="">All payments</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid (Cash)">Paid (Cash)</option>
          <option value="Paid (Card)">Paid (Card)</option>
          <option value="Paid (QR)">Paid (QR)</option>
        </select>
      </div>
    </section>

    <div class="orders-new-banner" v-if="hasNewOrders">
      <div class="orders-new-left">
        <span class="orders-new-dot"></span>
        <span class="orders-new-text">
          {{ newOrderCount }} new order{{ newOrderCount > 1 ? 's' : '' }} just arrived
        </span>
      </div>

      <button class="orders-new-btn" @click="onViewLatest">View latest</button>
    </div>

    <!-- ORDERS TABLE -->
    <AdminTable :columns="orderColumns" :rows="filteredOrders" title="All orders" :page-size="5">
      <!-- Details link -->
      <template #cell-details="{ row }">
        <RouterLink :to="{ name: 'admin-order-details', params: { id: row.id } }" class="btn-link">
          Details
        </RouterLink>
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
import { computed, ref, onMounted } from 'vue'
import { useOrdersStore, type OrderStatus } from '@/stores/useOrderStore'

/* =======================
   Store
======================= */
const ordersStore = useOrdersStore()

onMounted(() => {
  ordersStore.fetchAll()
})

/* =======================
   Banner state (optional)
======================= */
const hasNewOrders = computed(() =>
  ordersStore.items.some((o) => o.status === 'PENDING'),
)

const newOrderCount = computed(() =>
  ordersStore.items.filter((o) => o.status === 'PENDING').length,
)

const currentPage = ref(1)

/* =======================
   Types used by table
======================= */
type Channel = 'Cafe' | 'Room' | 'Take-away'
type PaymentStatus = 'Unpaid' | 'Paid (Cash)' | 'Paid (Card)' | 'Paid (QR)'

type OrderRow = {
  id: number
  date: string
  time: string
  customer: string
  channel: Channel
  itemsSummary: string
  total: number
  paymentStatus: PaymentStatus
  status: OrderStatus
}

/* =======================
   Columns
======================= */
const orderColumns: TableColumn[] = [
  { key: 'id', label: '#', width: '70px', align: 'left' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'customer', label: 'Customer' },
  { key: 'channel', label: 'Channel' },
  { key: 'itemsSummary', label: 'Items' },
  { key: 'total', label: 'Total (฿)', align: 'right' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'status', label: 'Status' },
  { key: 'details', label: '', align: 'right' },
  { key: 'actions', label: '', align: 'right' },
]

/* =======================
   FILTER STATE
======================= */
const search = ref('')
const statusFilter = ref('')
const channelFilter = ref('')
const paymentFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

/* =======================
   MAP backend → table rows
======================= */
const orders = computed<OrderRow[]>(() =>
  ordersStore.items.map((o) => ({
    id: o.id,
    date: o.date,
    time: o.time,
    customer: o.customer,
    channel: o.channel,
    itemsSummary: o.items.map((i) => `${i.quantity}× ${i.name}`).join(', '),
    total: o.total,
    paymentStatus: o.paymentStatus,
    status: o.status,
  })),
)

/* =======================
   FILTERED DATA
======================= */
const filteredOrders = computed(() => {
  const s = search.value.trim().toLowerCase()
  const start = startDateFilter.value
  const end = endDateFilter.value

  return orders.value.filter((o) => {
    const matchesSearch =
      !s ||
      String(o.id).includes(s) ||
      o.customer.toLowerCase().includes(s) ||
      o.itemsSummary.toLowerCase().includes(s)

    const matchesStatus = !statusFilter.value || o.status === statusFilter.value
    const matchesChannel = !channelFilter.value || o.channel === channelFilter.value
    const matchesPayment = !paymentFilter.value || o.paymentStatus === paymentFilter.value

    let matchesDate = true
    if (start && end) matchesDate = o.date >= start && o.date <= end
    else if (start) matchesDate = o.date >= start
    else if (end) matchesDate = o.date <= end

    return matchesSearch && matchesStatus && matchesChannel && matchesPayment && matchesDate
  })
})

/* =======================
   STATUS UI HELPERS
======================= */
function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'PENDING',
    'status-pill--prep': status === 'PREPARING',
    'status-pill--ready': status === 'SERVED',
    'status-pill--paid': status === 'CONFIRMED',
  }
}

/* =======================
   STATUS UPDATE DIALOG
======================= */
const statusDialogVisible = ref(false)
const statusTarget = ref<OrderRow | null>(null)
const statusToUpdate = ref<OrderStatus>('PENDING')

const statusOptions: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'SERVED',
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
  await ordersStore.update(statusTarget.value.id, {
    status: statusToUpdate.value,
  })
  statusDialogVisible.value = false
}

/* =======================
   CANCEL ORDER
======================= */
async function cancelOrder(order: OrderRow) {
  if (order.status === 'CONFIRMED') return
  await ordersStore.update(order.id, { status: 'CANCELLED' })
}

/* =======================
   VIEW LATEST
======================= */
function onViewLatest() {
  statusFilter.value = 'PENDING'
  currentPage.value = 1
}
</script>

<style scoped src="@/styles/admin/orders.css"></style>
