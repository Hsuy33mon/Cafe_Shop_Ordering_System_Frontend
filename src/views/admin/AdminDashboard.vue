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
                <th>Customer</th>
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
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/useDashboardStore'

const props = defineProps<{ search?: string }>()

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboard()
})

const dashboard = computed(() => dashboardStore.dashboard)

// KPI CARDS (dynamic)
const kpiCards = computed(() => {
  if (!dashboard.value) return []

  return [
    {
      label: "Today's orders",
      value: dashboard.value.todayOrders,
      subtext: `vs. ${dashboard.value.yesterdayOrders} yesterday`,
      trend: Number(dashboard.value.orderGrowthPercent.toFixed(1)),
    },
    {
      label: 'Profit (฿)',
      value: `฿${dashboard.value.todayProfitBaht.toLocaleString()}`,
      subtext: 'Today gross profit',
      trend: Number(dashboard.value.profitGrowthPercent.toFixed(1)),
    },
    {
      label: 'Active tables',
      value: dashboard.value.activeTables,
      subtext: `Out of ${dashboard.value.totalTables} tables`,
      trend: 0, // no growth yet
    },
    {
      label: 'Popular item',
      value: dashboard.value.popularItemName,
      subtext: `${dashboard.value.popularItemCount} orders today`,
      trend: 0, // can add later
    },
  ]
})

// Recent Orders (if backend provides)
const orders = computed(() => dashboard.value?.recentOrders ?? [])

const filteredOrders = computed(() => {
  const text = (props.search ?? '').trim().toLowerCase()
  if (!text) return orders.value

  return orders.value.filter((o: any) =>
    o.customer?.toLowerCase().includes(text) ||
    String(o.id).includes(text)
  )
})

// Channel stats (if backend provides)
const channelStats = computed(() => dashboard.value?.channelStats ?? [])

// Top categories (if backend provides)
const topCategories = computed(() => dashboard.value?.topCategories ?? [])

function statusClass(status: string) {
  return {
    'status-pill--new': status === 'New',
    'status-pill--prep': status === 'Preparing',
    'status-pill--ready': status === 'Ready',
    'status-pill--paid': status === 'Paid',
  }
}
</script>

<style scoped src="@/styles/admin/dashboard.css"></style>
