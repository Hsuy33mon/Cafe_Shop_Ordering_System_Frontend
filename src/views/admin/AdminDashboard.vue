<template>
  <main class="content">
    <!-- KPI CARDS -->
    <section class="kpi-grid">
      <article v-for="card in kpiCards" :key="card.label" class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">{{ card.label }}</span>
        </div>
        <p class="kpi-value">{{ card.value }}</p>
        <p class="kpi-sub">{{ card.subtext }}</p>
      </article>
    </section>

    <!-- MIDDLE ROW: ORDERS + STATS -->
    <section class="middle-grid">
      <div class="revenue-filter">
        <div class="filter-row">
          <button
            v-for="t in ['DAILY', 'MONTHLY']"
            :key="t"
            :class="{ active: currentType === t }"
            @click="changeType(t)"
          >
            {{ t }}
          </button>

          <!-- DAILY date picker -->
          <input
            v-if="currentType === 'DAILY'"
            type="date"
            v-model="selectedDate"
            @change="fetchWithSelectedPeriod"
            class="date-input"
          />

          <!-- MONTHLY month picker -->
          <input
            v-if="currentType === 'MONTHLY'"
            type="month"
            v-model="selectedMonth"
            @change="fetchWithSelectedPeriod"
            class="date-input"
          />
        </div>

        <div class="chart-wrapper">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div v-if="dashboardStore.categoryChart.length === 0" class="empty-chart">
        No orders count for this period
      </div>
      <div v-else class="revenue-filter">
        <div class="chart-header">
          <div>
            <h3>Order Count by Category</h3>
          </div>
        </div>
        <div class="chart-wrapper">
          <Bar :data="categoryChartData" :options="categoryChartOptions" />
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

import { Bar } from 'vue-chartjs'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchDashboard()
  await fetchWithSelectedPeriod()
})

const dashboard = computed(() => dashboardStore.dashboard)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

const categoryChartData = computed(() => {
  const sorted = [...dashboardStore.categoryChart].sort((a, b) => b.orderCount - a.orderCount)

  return {
    labels: sorted.map((p) => p.categoryName),
    datasets: [
      {
        label: 'Orders',
        data: sorted.map((p) => p.orderCount),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
    ],
  }
})

const kpiCards = computed(() => {
  if (!dashboard.value) return []

  return [
    {
      label: "Today's orders",
      value: dashboard.value.todayOrders,
      subtext: `vs. ${dashboard.value.yesterdayOrders} yesterday`,
    },
    {
      label: 'Profit (฿)',
      value: `฿${dashboard.value.todayProfitBaht.toLocaleString()}`,
      subtext: 'Today gross profit',
    },
    {
      label: 'Active tables',
      value: dashboard.value.activeTables,
      subtext: `Out of ${dashboard.value.totalTables} tables`,
    },
    {
      label: 'Popular item',
      value: dashboard.value.popularItemName,
      subtext: `${dashboard.value.todayOrders} orders today`,
    },
  ]
})

const currentType = ref<'DAILY' | 'MONTHLY'>('DAILY')

function changeType(type: 'DAILY' | 'MONTHLY') {
  currentType.value = type
  fetchWithSelectedPeriod()
}

const chartData = computed(() => ({
  labels: dashboardStore.revenueChart.map((p) =>
    new Date(p.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    }),
  ),
  datasets: [
    {
      label: 'Revenue (฿)',
      data: dashboardStore.revenueChart.map((p) => p.revenue),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Revenue (฿)',
      },
      beginAtZero: true,
    },
    x: {
      title: {
        display: true,
        text: currentType.value === 'DAILY' ? 'Date' : 'Month',
      },
    },
  },
}))

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const value = context.raw
          const percent = ((value / total) * 100).toFixed(1)
          return ` ${value} orders (${percent}%)`
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
      title: {
        display: true,
        text: 'Order Count',
      },
    },
  },
}

async function fetchWithSelectedPeriod() {
  if (currentType.value === 'DAILY') {
    await dashboardStore.fetchRevenue('DAILY', selectedDate.value)
    await dashboardStore.fetchCategoryOrders('DAILY', selectedDate.value)
  } else {
    await dashboardStore.fetchRevenue('MONTHLY', selectedMonth.value)
    await dashboardStore.fetchCategoryOrders('MONTHLY', selectedMonth.value)
  }
}
</script>
<style scoped src="@/styles/admin/dashboard.css"></style>
