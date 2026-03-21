<template>
  <div class="orders-page">
    <!-- background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <main class="orders-main">
      <!-- HERO -->
      <section class="cs-container hero">
        <div class="hero-header">
          <span class="hero-pill">My orders</span>
          <h1 class="hero-title">Order overview</h1>
          <p class="hero-subtitle cs-body-muted">
            View your in-progress and completed CafeShop orders. Tap an order to see detailed
            status.
          </p>
        </div>

        <!-- filters -->
        <div class="filters">
          <div class="input-wrapper">
            <span class="input-icon">🔍</span>
            <input
              v-model="searchText"
              type="text"
              class="search-input"
              placeholder="Search by order ID, room, items…"
            />
          </div>

          <div class="status-pills">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              type="button"
              class="pill"
              :class="{ 'pill--active': selectedStatus === tab.value }"
              @click="selectedStatus = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- ORDERS LIST -->
      <section class="cs-container">
        <div class="orders-card">
          <div class="orders-header">
            <h2 class="orders-title">Order history</h2>
            <p class="orders-caption">
              {{ filteredOrders.length }} order{{ filteredOrders.length === 1 ? '' : 's' }} found
            </p>
          </div>

          <!-- table (desktop) -->
          <div class="table-wrapper">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date & time</th>
                  <th>Room / Table</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Total (฿)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id" class="orders-row">
                  <td class="cell-id">#{{ order.id }}</td>
                  <td>
                    <div class="cell-main">{{ order.date }}</div>
                    <div class="cell-sub">{{ order.time }}</div>
                  </td>
                  <td>{{ order.roomOrTable }}</td>
                  <td>{{ displayType(order.type) }}</td>
                  <td>
                    <div class="cell-main">{{ order.items[0] }}</div>
                    <div v-if="order.items.length > 1" class="cell-sub">
                      + {{ order.items.length - 1 }} more
                    </div>
                  </td>
                  <td>{{ order.total }}</td>
                  <td>
                    <span class="status-pill" :class="statusClass(order.status)">
                      {{ displayStatus(order.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-if="filteredOrders.length === 0" class="empty-state">
              No orders yet. Once you place an order, it will appear here.
            </p>
          </div>

          <!-- mobile list -->
          <div class="orders-list-mobile">
            <article
              v-for="order in filteredOrders"
              :key="order.id + '-mobile'"
              class="order-card"
              @click="goToOrder(order)"
            >
              <div class="order-card-top">
                <div>
                  <p class="order-id">#{{ order.id }}</p>
                  <p class="order-meta">{{ order.date }} · {{ order.time }}</p>
                </div>
                <span class="status-pill" :class="statusClass(order.status)">
                  {{ displayStatus(order.status) }}
                </span>
              </div>

              <div class="order-card-middle">
                <p class="order-room">{{ order.roomOrTable }} · {{ displayType(order.type) }}</p>
                <p class="order-items">
                  {{ order.items[0] }}
                  <span v-if="order.items.length > 1"> + {{ order.items.length - 1 }} more </span>
                </p>
              </div>

              <div class="order-card-bottom">
                <span class="order-total-label">Total</span>
                <span class="order-total-value">฿{{ order.total }}</span>
              </div>
            </article>

            <p v-if="filteredOrders.length === 0" class="empty-state">
              No orders yet. Once you place an order, it will appear here.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, computed, ref, onUnmounted } from 'vue'
import { useOrdersStore } from '../stores/useOrderStore'

let interval: any = null
const ordersStore = useOrdersStore()

onMounted(async () => {
  const invoiceIds = JSON.parse(localStorage.getItem('invoiceIds') || '[]')

  if (!invoiceIds.length) return

  // 🔥 clear old data first
  ordersStore.items = []

  for (const id of invoiceIds) {
    await ordersStore.fetchByInvoice(id)
  }

  interval = setInterval(async () => {
    ordersStore.items = []

    for (const id of invoiceIds) {
      await ordersStore.fetchByInvoice(id)
    }
  }, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const orders = computed(() => ordersStore.items)

const mappedOrders = computed(() => {
  return orders.value.map((o) => ({
    id: o.id,
    date: o.date,
    time: o.time,
    roomOrTable: o.tableNo || '-',
    type: mapType(o.channel),
    items: o.items.map((i) => `${i.quantity} × ${i.name}`),
    total: o.total,
    // status: mapStatus(o.status),
    status: o.status,
  }))
})

function mapStatus(status: string): OrderStatus {
  return status as OrderStatus
}
function displayStatus(status: string): string {
  const map = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }

  return map[status] || status
}

function mapType(type: string): OrderType {
  if (type === 'ROOM') return 'room'
  if (type === 'TABLE') return 'table'
  return 'table'
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
type OrderType = 'room' | 'table' | 'pickup'

type OrderOverview = {
  id: number
  date: string
  time: string
  roomOrTable: string
  type: OrderType
  items: string[]
  total: number
  status: OrderStatus
}

const router = useRouter()

const searchText = ref('')

const selectedStatus = ref<
  'all' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
>('all')

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const filteredOrders = computed(() => {
  const text = searchText.value.trim().toLowerCase()
  const status = selectedStatus.value

  return mappedOrders.value.filter((o) => {
    const byStatus = status === 'all' || o.status === status
    const byText =
      !text ||
      String(o.id).includes(text) ||
      o.roomOrTable.toLowerCase().includes(text) ||
      o.items.some((item) => item.toLowerCase().includes(text))

    return byStatus && byText
  })
})

function displayType(type: OrderType): string {
  if (type === 'room') return 'Room service'
  if (type === 'table') return 'Table'
  return type
}

function statusClass(status: OrderStatus) {
  return {
    'status-pill--pending': status === 'PENDING',
    'status-pill--preparing': status === 'PREPARING',
    'status-pill--ready': status === 'READY',
    'status-pill--completed': status === 'COMPLETED',
  }
}

// navigate to detailed status view
function goToOrder(order: OrderOverview) {
  // adjust route name/path to match your router config
  router.push({
    name: 'order-status', // e.g. { path: '/order-status/:id', name: 'order-status' }
    params: { id: order.id },
  })
}
</script>
<style scoped src="@/styles/customer/order-page.css"></style>
