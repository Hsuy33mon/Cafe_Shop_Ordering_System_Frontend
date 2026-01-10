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
                <tr
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="orders-row"
                  @click="goToOrder(order)"
                >
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

type OrderStatus = 'in_progress' | 'completed'
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

// mock orders (replace with real API later)
const orders = ref<OrderOverview[]>([
  {
    id: 1042,
    date: 'Today',
    time: '10:12',
    roomOrTable: 'Room 1205',
    type: 'room',
    items: ['2 × Iced Caramel Latte', '1 × Chocolate Cake'],
    total: 320,
    status: 'in_progress',
  },
  {
    id: 1041,
    date: 'Today',
    time: '09:58',
    roomOrTable: 'Table A3',
    type: 'table',
    items: ['Gourmet Burger set'],
    total: 240,
    status: 'completed',
  },
  {
    id: 1038,
    date: 'Yesterday',
    time: '18:45',
    roomOrTable: 'Pick-up #09',
    type: 'pickup',
    items: ['House Blend Beans 250g'],
    total: 320,
    status: 'completed',
  },
  {
    id: 1035,
    date: 'Yesterday',
    time: '11:30',
    roomOrTable: 'Room 810',
    type: 'room',
    items: ['Breakfast set', 'Orange juice'],
    total: 420,
    status: 'completed',
  },
])

const router = useRouter()

const searchText = ref('')
const selectedStatus = ref<'all' | OrderStatus>('all')

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

const filteredOrders = computed(() => {
  const text = searchText.value.trim().toLowerCase()
  const status = selectedStatus.value

  return orders.value.filter((o) => {
    const byStatus = status === 'all' || o.status === status
    const byText =
      !text ||
      String(o.id).includes(text) ||
      o.roomOrTable.toLowerCase().includes(text) ||
      o.items.some((item) => item.toLowerCase().includes(text))

    return byStatus && byText
  })
})

function displayStatus(status: OrderStatus): string {
  if (status === 'in_progress') return 'In progress'
  if (status === 'completed') return 'Completed'
  return status
}

function displayType(type: OrderType): string {
  if (type === 'room') return 'Room service'
  if (type === 'table') return 'Table'
  if (type === 'pickup') return 'Pick-up'
  return type
}

function statusClass(status: OrderStatus) {
  return {
    'status-pill--progress': status === 'in_progress',
    'status-pill--completed': status === 'completed',
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
