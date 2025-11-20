<!-- src/views/admin/AdminDashboard.vue -->
<template>
  <!-- Only the dashboard content, no layout shell -->
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
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

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

// Receive search text from AdminLayout (optional but recommended)
const props = defineProps<{
  search?: string
}>()

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

const filteredOrders = computed(() => {
  const text = (props.search ?? '').trim().toLowerCase()
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

function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'New',
    'status-pill--prep': status === 'Preparing',
    'status-pill--ready': status === 'Ready',
    'status-pill--paid': status === 'Paid',
  }
}
</script>

<style scoped src="@/styles/admin/dashboard.css"></style>
