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

<style scoped>
.orders-page {
  position: relative;
  background: radial-gradient(circle at top left, #fff7d6 0, #f9fafb 40%, #eef2ff 100%);
  min-height: 100vh;
  overflow: hidden;
}

/* background shapes */
.bg-shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.55;
  pointer-events: none;
  z-index: 0;
}

.bg-shape--one {
  width: 260px;
  height: 260px;
  background: #facc15;
  top: -60px;
  right: 8%;
  animation: floatShape 18s ease-in-out infinite;
}

.bg-shape--two {
  width: 220px;
  height: 220px;
  background: #a855f7;
  bottom: -80px;
  left: 4%;
  animation: floatShape 22s ease-in-out infinite;
}

.orders-main {
  padding-block: 2.4rem 3rem;
  position: relative;
  z-index: 1;
}

/* ---------- HERO ---------- */
.hero {
  margin-bottom: 2rem;
}

.hero-header {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 1.2rem;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.35);
  backdrop-filter: blur(10px);
}

.hero-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

.hero-title {
  margin-top: 0.7rem;
  font-size: 1.6rem;
  font-weight: 700;
}

.hero-subtitle {
  margin-top: 0.4rem;
  font-size: 0.95rem;
}

/* filters */
.filters {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
}

.input-wrapper {
  position: relative;
  min-width: 260px;
  max-width: 420px;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.65;
}

.search-input {
  width: 100%;
  padding: 0.65rem 0.9rem 0.65rem 2.1rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  outline: none;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: #9ca3af;
}

.status-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.pill {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(255, 255, 255, 0.85);
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.pill--active {
  background: linear-gradient(135deg, #facc15, #f97316);
  border-color: transparent;
  color: #111827;
}

/* ---------- ORDERS CARD ---------- */
.orders-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  padding: 1.1rem 1.3rem 1.3rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(248, 250, 252, 0.95);
}

.orders-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.orders-title {
  font-size: 1.02rem;
  font-weight: 700;
}

.orders-caption {
  font-size: 0.8rem;
  color: #6b7280;
}

/* desktop table */
.table-wrapper {
  display: block;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.orders-table th,
.orders-table td {
  padding: 0.45rem 0.4rem;
  text-align: left;
}

.orders-table thead {
  background-color: #f9fafb;
}

.orders-table th {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.orders-row {
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.orders-row:nth-child(even) {
  background-color: #f9fafb;
}

.orders-row:hover {
  background-color: #eef2ff;
}

.cell-main {
  font-size: 0.8rem;
}

.cell-sub {
  font-size: 0.72rem;
  color: #9ca3af;
}

.cell-id {
  font-weight: 600;
}

/* status pill */
.status-pill {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
}

.status-pill--progress {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-pill--completed {
  background-color: #dcfce7;
  color: #166534;
}

/* mobile cards */
.orders-list-mobile {
  display: none;
  margin-top: 0.5rem;
}

.order-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 0.8rem;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  cursor: pointer;
}

.order-card + .order-card {
  margin-top: 0.7rem;
}

.order-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-id {
  font-size: 0.9rem;
  font-weight: 600;
}

.order-meta {
  font-size: 0.78rem;
  color: #6b7280;
}

.order-card-middle {
  font-size: 0.8rem;
}

.order-room {
  color: #4b5563;
}

.order-items {
  font-size: 0.78rem;
  color: #6b7280;
}

.order-card-bottom {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  font-size: 0.8rem;
  margin-top: 0.1rem;
}

.order-total-label {
  color: #9ca3af;
}

.order-total-value {
  font-weight: 600;
}

.empty-state {
  margin-top: 0.8rem;
  font-size: 0.86rem;
  color: #6b7280;
  text-align: center;
}

/* animations */
@keyframes floatShape {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(12px, -16px, 0);
  }
}

/* responsive */
@media (max-width: 768px) {
  .orders-card {
    padding-inline: 1rem;
  }

  .orders-table {
    display: none;
  }

  .orders-list-mobile {
    display: block;
  }
}
</style>
