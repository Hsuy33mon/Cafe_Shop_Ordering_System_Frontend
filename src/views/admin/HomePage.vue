<template>
  <div class="admin-page">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">☕</div>
        <div class="logo-text">
          <span class="logo-main">CafeShop</span>
          <span class="logo-sub">Admin</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in sidebarItems"
          :key="item.label"
          type="button"
          class="sidebar-link"
          :class="{ 'sidebar-link--active': activeMenu === item.key }"
          @click="activeMenu = item.key"
        >
          <span class="sidebar-link-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <p class="sidebar-status-label">Today</p>
        <p class="sidebar-status-value">{{ todaySummary }}</p>
      </div>
    </aside>

    <!-- MAIN AREA -->
    <div class="admin-main">
      <!-- TOP BAR -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">Dashboard</h1>
          <p class="topbar-subtitle">Overview of today’s activity at CafeShop.</p>
        </div>

        <div class="topbar-right">
          <div class="topbar-search">
            <span class="search-icon">🔍</span>
            <input
              v-model="search"
              type="text"
              class="search-input"
              placeholder="Search orders, customers…"
            />
          </div>

          <div class="topbar-user">
            <div class="user-initial">M</div>
            <div class="user-meta">
              <span class="user-name">Manager</span>
              <span class="user-role">Cafe admin</span>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="content">
        <!-- KPI CARDS -->
        <section class="kpi-grid">
          <article v-for="card in kpiCards" :key="card.label" class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">{{ card.label }}</span>
              <span class="kpi-tag" :class="card.trend > 0 ? 'kpi-tag--up' : 'kpi-tag--down'">
                {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}%
              </span>
            </div>
            <p class="kpi-value">{{ card.value }}</p>
            <p class="kpi-sub">{{ card.subtext }}</p>
          </article>
        </section>

        <!-- MIDDLE ROW: ORDERS + STATS -->
        <section class="middle-grid">
          <!-- RECENT ORDERS -->
          <article class="panel panel--orders">
            <div class="panel-header">
              <h2 class="panel-title">Recent orders</h2>
              <span class="panel-caption">Last 10 tickets</span>
            </div>

            <div class="table-wrapper">
              <table class="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                    <th>Customer / Room</th>
                    <th>Type</th>
                    <th>Total (฿)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in filteredOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.time }}</td>
                    <td>
                      <div class="cell-main">{{ order.customer }}</div>
                      <div class="cell-sub" v-if="order.meta">{{ order.meta }}</div>
                    </td>
                    <td>{{ order.channel }}</td>
                    <td>{{ order.total }}</td>
                    <td>
                      <span class="status-pill" :class="statusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <!-- QUICK STATS -->
          <article class="panel panel--stats">
            <div class="panel-header">
              <h2 class="panel-title">Today at a glance</h2>
              <span class="panel-caption">Updated every minute</span>
            </div>

            <div class="stats-grid">
              <div class="stat-block">
                <p class="stat-label">Orders per channel</p>
                <ul class="stat-list">
                  <li v-for="channel in channelStats" :key="channel.label">
                    <span class="stat-name">{{ channel.label }}</span>
                    <span class="stat-bar">
                      <span class="stat-fill" :style="{ width: channel.percent + '%' }"></span>
                    </span>
                    <span class="stat-value">{{ channel.count }}</span>
                  </li>
                </ul>
              </div>

              <div class="stat-block">
                <p class="stat-label">Top categories</p>
                <ul class="stat-tags">
                  <li v-for="cat in topCategories" :key="cat.name" class="stat-tag">
                    <span class="dot"></span>
                    <span>{{ cat.name }}</span>
                    <span class="stat-tag-count">{{ cat.orders }} orders</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type SidebarItem = {
  key: string
  label: string
  icon: string
}

type KpiCard = {
  label: string
  value: string
  subtext: string
  trend: number
}

type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Paid'

type Order = {
  id: number
  time: string
  customer: string
  meta?: string
  channel: 'Cafe' | 'Room' | 'Take-away'
  total: number
  status: OrderStatus
}

// sidebar
const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'orders', label: 'Orders', icon: '🧾' },
  { key: 'menu', label: 'Menu items', icon: '🍽' },
  { key: 'tables', label: 'Tables', icon: '🪑' },
  { key: 'customers', label: 'Customers', icon: '👥' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]
const activeMenu = ref('dashboard')

// kpi cards
const kpiCards: KpiCard[] = [
  {
    label: "Today's orders",
    value: '128',
    subtext: 'vs. 115 yesterday',
    trend: 11,
  },
  {
    label: 'Revenue',
    value: '฿18,420',
    subtext: 'Today (incl. room service)',
    trend: 8,
  },
  {
    label: 'Active tables',
    value: '9',
    subtext: 'Out of 24 seats',
    trend: 3,
  },
  {
    label: 'Popular item',
    value: 'Iced Caramel Latte',
    subtext: '37 orders today',
    trend: 15,
  },
]

// orders
const orders = ref<Order[]>([
  {
    id: 1042,
    time: '10:12',
    customer: 'Room 1205',
    meta: '2 x Iced Latte, 1 x Cake',
    channel: 'Room',
    total: 320,
    status: 'Preparing',
  },
  {
    id: 1041,
    time: '10:05',
    customer: 'Walk-in',
    meta: 'Gourmet Burger set',
    channel: 'Cafe',
    total: 240,
    status: 'Ready',
  },
  {
    id: 1040,
    time: '09:58',
    customer: 'Take-away #09',
    meta: 'Matcha Latte, Croissant',
    channel: 'Take-away',
    total: 170,
    status: 'Paid',
  },
  {
    id: 1039,
    time: '09:45',
    customer: 'Room 810',
    meta: 'Breakfast set',
    channel: 'Room',
    total: 420,
    status: 'Preparing',
  },
  {
    id: 1038,
    time: '09:32',
    customer: 'Walk-in',
    meta: 'Saumon Gravlax',
    channel: 'Cafe',
    total: 260,
    status: 'Paid',
  },
  {
    id: 1037,
    time: '09:20',
    customer: 'Take-away #07',
    meta: '2 x Americano',
    channel: 'Take-away',
    total: 120,
    status: 'Paid',
  },
])

const search = ref('')

const filteredOrders = computed(() => {
  const text = search.value.trim().toLowerCase()
  if (!text) return orders.value

  return orders.value.filter((o) => {
    return (
      o.customer.toLowerCase().includes(text) ||
      (o.meta && o.meta.toLowerCase().includes(text)) ||
      String(o.id).includes(text)
    )
  })
})

// stats
const channelStats = [
  { label: 'Cafe', count: 64, percent: 55 },
  { label: 'Room service', count: 38, percent: 32 },
  { label: 'Take-away', count: 16, percent: 13 },
]

const topCategories = [
  { name: 'Coffee & drinks', orders: 72 },
  { name: 'Burgers & mains', orders: 28 },
  { name: 'Desserts', orders: 18 },
]

const todaySummary = '128 orders · ฿18,420 revenue'

function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'New',
    'status-pill--prep': status === 'Preparing',
    'status-pill--ready': status === 'Ready',
    'status-pill--paid': status === 'Paid',
  }
}
</script>

<style scoped>
.admin-page {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: 100vh;
  background-color: #f3f4f6;
}

/* ---------- SIDEBAR ---------- */
.sidebar {
  background-color: #0f172a;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1.1rem 1rem;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.6rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background-color: #facc15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-main {
  font-weight: 700;
  font-size: 0.98rem;
}

.logo-sub {
  font-size: 0.7rem;
  color: #9ca3af;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: auto;
}

.sidebar-link {
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #e5e7eb;
  padding: 0.5rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.86rem;
  cursor: pointer;
  transition:
    background-color 0.14s ease,
    color 0.14s ease;
}

.sidebar-link-icon {
  width: 22px;
  text-align: center;
}

.sidebar-link:hover {
  background-color: rgba(148, 163, 184, 0.25);
}

.sidebar-link--active {
  background: linear-gradient(135deg, #facc15, #f97316);
  color: #111827;
}

.sidebar-footer {
  margin-top: 1.4rem;
  padding: 0.7rem 0.6rem;
  border-radius: 10px;
  background-color: #020617;
  font-size: 0.78rem;
}

.sidebar-status-label {
  color: #9ca3af;
  margin-bottom: 0.2rem;
}

.sidebar-status-value {
  color: #e5e7eb;
}

/* ---------- MAIN ---------- */
.admin-main {
  display: flex;
  flex-direction: column;
}

/* TOPBAR */
.topbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-left {
  display: flex;
  flex-direction: column;
}

.topbar-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.topbar-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-search {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  opacity: 0.7;
}

.search-input {
  padding: 0.4rem 0.7rem 0.4rem 1.9rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 0.82rem;
  outline: none;
}

.search-input:focus {
  border-color: #facc15;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-initial {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background-color: #0f172a;
  color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8rem;
  font-weight: 600;
}

.user-role {
  font-size: 0.72rem;
  color: #6b7280;
}

/* CONTENT WRAPPER */
.content {
  padding: 1.2rem 1.5rem 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.kpi-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 0.8rem 0.9rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.kpi-tag {
  font-size: 0.72rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.kpi-tag--up {
  background-color: #dcfce7;
  color: #166534;
}

.kpi-tag--down {
  background-color: #fee2e2;
  color: #b91c1c;
}

.kpi-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.kpi-sub {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* MIDDLE GRID */
.middle-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.3fr) minmax(0, 1.7fr);
  gap: 1rem;
}

/* PANELS */
.panel {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 0.9rem 1rem;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
}

.panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.panel-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.panel-caption {
  font-size: 0.74rem;
  color: #9ca3af;
}

/* Orders table */
.table-wrapper {
  max-height: 310px;
  overflow: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.orders-table th,
.orders-table td {
  padding: 0.35rem 0.35rem;
  text-align: left;
}

.orders-table thead {
  background-color: #f9fafb;
}

.orders-table th {
  font-weight: 600;
  font-size: 0.75rem;
  color: #6b7280;
}

.orders-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.cell-main {
  font-size: 0.8rem;
}

.cell-sub {
  font-size: 0.72rem;
  color: #9ca3af;
}

/* status pill */
.status-pill {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
}

.status-pill--new {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-pill--prep {
  background-color: #fef9c3;
  color: #854d0e;
}

.status-pill--ready {
  background-color: #dcfce7;
  color: #166534;
}

.status-pill--paid {
  background-color: #e5e7eb;
  color: #111827;
}

/* Stats panel */
.stats-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 0.9rem;
  margin-top: 0.4rem;
}

.stat-block {
  font-size: 0.8rem;
}

.stat-label {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.stat-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-list li {
  display: grid;
  grid-template-columns: 1.2fr 2.2fr auto;
  gap: 0.4rem;
  align-items: center;
}

.stat-name {
  color: #4b5563;
}

.stat-bar {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background-color: #e5e7eb;
  overflow: hidden;
}

.stat-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #facc15, #f97316);
}

.stat-value {
  font-size: 0.76rem;
  color: #6b7280;
}

/* tags */
.stat-tags {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: #4b5563;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background-color: #f97316;
}

.stat-tag-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 1024px) {
  .admin-page {
    grid-template-columns: 70px minmax(0, 1fr);
  }

  .sidebar-logo .logo-text {
    display: none;
  }

  .sidebar-link span:not(.sidebar-link-icon) {
    display: none;
  }
}

@media (max-width: 800px) {
  .admin-page {
    grid-template-columns: minmax(0, 1fr);
  }

  .sidebar {
    display: none;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .middle-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .stats-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
