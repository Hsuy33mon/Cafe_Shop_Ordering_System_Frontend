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
    <AdminTable
      :columns="orderColumns"
      :rows="filteredOrders"
      title="All orders"
      :page-size="10"
      @page-change="onPageChange"
    >
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
import { computed, ref } from 'vue'
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
const hasNewOrders = ref(true)
const newOrderCount = ref(3)
const currentPage = ref(1)

type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Canceled'
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
  { key: 'actions', label: '', align: 'right' }, // slot-only column
]

// --- FILTER STATE ---
const search = ref('')
const statusFilter = ref<string>('')
const channelFilter = ref<string>('')
const paymentFilter = ref<string>('')
const startDateFilter = ref<string>('')
const endDateFilter = ref<string>('')

// --- DUMMY DATA ---
const orders = ref<OrderRow[]>([
  {
    id: 1050,
    date: '2025-11-20',
    time: '11:20',
    customer: 'Room 1205',
    channel: 'Room',
    itemsSummary: '2× Iced Latte, 1× Cake',
    total: 320,
    paymentStatus: 'Unpaid',
    status: 'New',
  },
  {
    id: 1049,
    date: '2025-11-20',
    time: '11:10',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Gourmet Burger set',
    total: 260,
    paymentStatus: 'Paid (Card)',
    status: 'Completed',
  },
  {
    id: 1048,
    date: '2025-11-20',
    time: '10:58',
    customer: 'Take-away #12',
    channel: 'Take-away',
    itemsSummary: 'Matcha Latte, Croissant',
    total: 170,
    paymentStatus: 'Paid (QR)',
    status: 'Ready',
  },
  {
    id: 1047,
    date: '2025-11-20',
    time: '10:45',
    customer: 'Room 810',
    channel: 'Room',
    itemsSummary: 'Breakfast set',
    total: 420,
    paymentStatus: 'Unpaid',
    status: 'Preparing',
  },
  {
    id: 1046,
    date: '2025-11-20',
    time: '10:32',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Saumon Gravlax',
    total: 260,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1045,
    date: '2025-11-20',
    time: '10:20',
    customer: 'Take-away #11',
    channel: 'Take-away',
    itemsSummary: '2× Americano',
    total: 120,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1044,
    date: '2025-11-19',
    time: '18:05',
    customer: 'Room 1502',
    channel: 'Room',
    itemsSummary: 'Pasta, Sparkling water',
    total: 380,
    paymentStatus: 'Paid (Card)',
    status: 'Completed',
  },
  {
    id: 1043,
    date: '2025-11-19',
    time: '17:42',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Iced Caramel Latte',
    total: 95,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1042,
    date: '2025-11-19',
    time: '16:30',
    customer: 'Take-away #09',
    channel: 'Take-away',
    itemsSummary: '2× Cappuccino',
    total: 150,
    paymentStatus: 'Unpaid',
    status: 'Canceled',
  },
  {
    id: 1041,
    date: '2025-11-19',
    time: '15:12',
    customer: 'Room 907',
    channel: 'Room',
    itemsSummary: 'Club sandwich, Fries',
    total: 310,
    paymentStatus: 'Paid (Card)',
    status: 'Completed',
  },
  {
    id: 1040,
    date: '2025-11-19',
    time: '14:00',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Latte, Cheesecake',
    total: 210,
    paymentStatus: 'Paid (QR)',
    status: 'Completed',
  },
  {
    id: 1046,
    date: '2025-11-20',
    time: '10:32',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Saumon Gravlax',
    total: 260,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1045,
    date: '2025-11-20',
    time: '10:20',
    customer: 'Take-away #11',
    channel: 'Take-away',
    itemsSummary: '2× Americano',
    total: 120,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1044,
    date: '2025-11-19',
    time: '18:05',
    customer: 'Room 1502',
    channel: 'Room',
    itemsSummary: 'Pasta, Sparkling water',
    total: 380,
    paymentStatus: 'Paid (Card)',
    status: 'Completed',
  },
  {
    id: 1043,
    date: '2025-11-19',
    time: '17:42',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Iced Caramel Latte',
    total: 95,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1042,
    date: '2025-11-19',
    time: '16:30',
    customer: 'Take-away #09',
    channel: 'Take-away',
    itemsSummary: '2× Cappuccino',
    total: 150,
    paymentStatus: 'Unpaid',
    status: 'Canceled',
  },
  {
    id: 1041,
    date: '2025-11-19',
    time: '15:12',
    customer: 'Room 907',
    channel: 'Room',
    itemsSummary: 'Club sandwich, Fries',
    total: 310,
    paymentStatus: 'Paid (Card)',
    status: 'Completed',
  },
  {
    id: 1040,
    date: '2025-11-19',
    time: '14:00',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Latte, Cheesecake',
    total: 210,
    paymentStatus: 'Paid (QR)',
    status: 'Completed',
  },
])

// --- FILTERED DATA (AdminTable will paginate this) ---
const filteredOrders = computed(() => {
  const s = search.value.trim().toLowerCase()
  const start = startDateFilter.value
  const end = endDateFilter.value

  return orders.value.filter((o) => {
    const matchesSearch =
      !s ||
      String(o.id).includes(s) ||
      o.customer.toLowerCase().includes(s) ||
      o.itemsSummary.toLowerCase().includes(s) ||
      o.channel.toLowerCase().includes(s)

    const matchesStatus = !statusFilter.value || o.status === statusFilter.value
    const matchesChannel = !channelFilter.value || o.channel === channelFilter.value
    const matchesPayment = !paymentFilter.value || o.paymentStatus === paymentFilter.value

    // date is stored as 'YYYY-MM-DD', so string comparison works
    let matchesDate = true
    if (start && end) {
      matchesDate = o.date >= start && o.date <= end
    } else if (start) {
      matchesDate = o.date >= start
    } else if (end) {
      matchesDate = o.date <= end
    }

    return matchesSearch && matchesStatus && matchesChannel && matchesPayment && matchesDate
  })
})

function onPageChange(page: number) {
  // optional: track page or sync with URL
  console.log('page changed to', page)
}

function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'New',
    'status-pill--prep': status === 'Preparing',
    'status-pill--ready': status === 'Ready',
    'status-pill--paid': status === 'Completed',
  }
}

// --- STATUS DIALOG STATE ---
const statusDialogVisible = ref(false)
const statusTarget = ref<OrderRow | null>(null)
const statusToUpdate = ref<OrderStatus>('New')
const statusOptions: OrderStatus[] = ['New', 'Preparing', 'Ready', 'Completed', 'Canceled']

function openStatusDialog(order: OrderRow) {
  statusTarget.value = order
  statusToUpdate.value = order.status
  statusDialogVisible.value = true
}

function closeStatusDialog() {
  statusDialogVisible.value = false
  statusTarget.value = null
}

function confirmStatusUpdate() {
  if (!statusTarget.value) return
  statusTarget.value.status = statusToUpdate.value
  // later: call API
  statusDialogVisible.value = false
}

// cancel order (demo)
function cancelOrder(order: OrderRow) {
  if (order.status === 'Completed') return
  order.status = 'Canceled'
  order.paymentStatus = 'Unpaid'
}
function onViewLatest() {
  // show only "New" orders
  statusFilter.value = 'New'

  // go to first page, where newest orders are
  currentPage.value = 1

  // optional: hide the green banner after user clicks
  hasNewOrders.value = false
}
</script>

<style scoped src="@/styles/admin/orders.css"></style>
