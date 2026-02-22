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
      <div class="revenue-filter">
        <button v-for="t in ['DAILY', 'MONTHLY']" :key="t" :class="{ active: currentType === t }"
          @click="changeType(t)">
          {{ t }}
        </button>
        <div class="chart-wrapper">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>


      <!-- RECENT ORDERS -->
      <!-- <article class="panel panel--orders">
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
      </article> -->

      <!-- QUICK STATS -->
      <!-- <article class="panel panel--stats">
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
      </article> -->
    </section>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useDashboardStore } from '@/stores/useDashboardStore'

import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

const props = defineProps<{ search?: string }>()

const dashboardStore = useDashboardStore()

// ======================
// DASHBOARD DATA
// ======================

onMounted(async () => {
  await dashboardStore.fetchDashboard()
  await dashboardStore.fetchRevenue(currentType.value)
})

const dashboard = computed(() => dashboardStore.dashboard)

// ======================
// KPI CARDS
// ======================

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
      trend: 0,
    },
    {
      label: 'Popular item',
      value: dashboard.value.popularItemName,
      subtext: `${dashboard.value.popularItemCount} orders today`,
      trend: 0,
    },
  ]
})

// ======================
// REVENUE CHART
// ======================

const currentType = ref<'DAILY' | 'MONTHLY'>('DAILY')

function changeType(type: 'DAILY' | 'MONTHLY') {
  currentType.value = type
  dashboardStore.fetchRevenue(type)
}

const chartData = computed(() => ({
  labels: dashboardStore.revenueChart.map(p => p.label),
  datasets: [
    {
      label: 'Revenue (฿)',
      data: dashboardStore.revenueChart.map(p => p.revenue),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
}

// ======================
// SEARCH FILTER (Optional)
// ======================

const orders = computed(() => dashboard.value?.recentOrders ?? [])

const filteredOrders = computed(() => {
  const text = (props.search ?? '').trim().toLowerCase()
  if (!text) return orders.value

  return orders.value.filter((o: any) =>
    o.customer?.toLowerCase().includes(text) ||
    String(o.id).includes(text)
  )
})

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
