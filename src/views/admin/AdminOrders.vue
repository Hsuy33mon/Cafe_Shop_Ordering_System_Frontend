<template>
  <main class="content">
    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by order #, customer, room, items…"
        />

        <select v-model="statusFilter" class="filter-select">
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>

        <select v-model="channelFilter" class="filter-select">
          <option value="">All channels</option>
          <option value="Cafe">Cafe</option>
          <option value="Room">Room</option>
          <option value="Take-away">Take-away</option>
        </select>

        <select v-model="paymentFilter" class="filter-select">
          <option value="">All payments</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid (Cash)">Paid (Cash)</option>
          <option value="Paid (Card)">Paid (Card)</option>
          <option value="Paid (QR)">Paid (QR)</option>
        </select>
      </div>
    </section>

    <!-- ORDERS TABLE -->
    <section class="panel panel--orders">
      <div class="panel-header">
        <h2 class="panel-title">All orders</h2>
        <span class="panel-caption">
          {{ filteredOrders.length }} orders · page {{ currentPage }} / {{ totalPages }}
        </span>
      </div>

      <div class="table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Items</th>
              <th>Total (฿)</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pagedOrders.length === 0">
              <td colspan="10">No orders found.</td>
            </tr>
            <tr v-for="order in pagedOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td>{{ order.time }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.channel }}</td>
              <td>{{ order.itemsSummary }}</td>
              <td>{{ order.total }}</td>
              <td>
                <button class="payment-pill" @click="togglePayment(order)">
                  {{ order.paymentStatus }}
                </button>
              </td>
              <td>
                <span class="status-pill" :class="statusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="table-actions">
                <button class="btn-link" @click="openStatusDialog(order)">Update status</button>
                <button class="btn-link btn-link--danger" @click="cancelOrder(order)">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="pagination" v-if="totalPages > 1">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ‹ Prev
        </button>

        <button
          v-for="page in pageNumbers"
          :key="page"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next ›
        </button>
      </div>
    </section>
  </main>
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
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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

// --- FILTER STATE ---
const search = ref('')
const statusFilter = ref<string>('')
const channelFilter = ref<string>('')
const paymentFilter = ref<string>('')

// --- PAGINATION ---
const currentPage = ref(1)
const pageSize = ref(10)

// --- DUMMY DATA (demo) ---
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
  // extra older demo orders
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
    id: 1039,
    date: '2025-11-18',
    time: '12:15',
    customer: 'Take-away #07',
    channel: 'Take-away',
    itemsSummary: '3× Americano',
    total: 180,
    paymentStatus: 'Paid (Cash)',
    status: 'Completed',
  },
  {
    id: 1038,
    date: '2025-11-18',
    time: '11:45',
    customer: 'Room 504',
    channel: 'Room',
    itemsSummary: 'Breakfast set',
    total: 420,
    paymentStatus: 'Unpaid',
    status: 'New',
  },
  {
    id: 1037,
    date: '2025-11-18',
    time: '09:05',
    customer: 'Walk-in',
    channel: 'Cafe',
    itemsSummary: 'Espresso, Croissant',
    total: 150,
    paymentStatus: 'Paid (Card)',
    status: 'Completed',
  },
])

// --- FILTERED + PAGINATED DATA ---

const filteredOrders = computed(() => {
  const s = search.value.trim().toLowerCase()

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

    return matchesSearch && matchesStatus && matchesChannel && matchesPayment
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredOrders.value.length / pageSize.value)),
)

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// create small page number list (1..totalPages)
const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

// whenever filters or search change, reset to page 1
watch([search, statusFilter, channelFilter, paymentFilter], () => {
  currentPage.value = 1
})

// --- UI ACTIONS / UPDATE FUNCTIONS ---

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
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

// available choices in dialog
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
  // here you’d call API in a real app
  statusDialogVisible.value = false
}

// toggle payment status for demo
function togglePayment(order: OrderRow) {
  if (order.paymentStatus === 'Unpaid') {
    order.paymentStatus = 'Paid (Cash)'
  } else {
    order.paymentStatus = 'Unpaid'
  }
  // real app: call API to persist payment change
}

// cancel order (demo)
function cancelOrder(order: OrderRow) {
  if (order.status === 'Completed') {
    // maybe do nothing / show warning in real app
    return
  }
  order.status = 'Canceled'
  order.paymentStatus = 'Unpaid'
  // real app: call API to cancel
}
</script>

<style scoped src="@/styles/admin/orders.css"></style>
