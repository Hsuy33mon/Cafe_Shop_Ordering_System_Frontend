<template>
  <main class="content">
    <div class="revenue-filter">
      <div class="filter-row">
        <button v-for="t in ['DAILY', 'WEEKLY', 'MONTHLY']" :key="t" :class="{ active: currentType === t }"
          @click="changeType(t)">
          {{ t }}
        </button>

        <!-- DAILY date picker -->
        <input v-if="currentType === 'DAILY'" type="date" v-model="selectedDate" @change="fetchWithSelectedPeriod"
          class="date-input" />

        <!-- WEEKLY date picker -->
      <!-- WEEKLY date picker -->
<div v-if="currentType === 'WEEKLY'" class="week-picker">
  <input
    type="date"
    v-model="selectedWeek"
    @change="onWeekChange"
    class="date-input"
  />

  <span class="week-label">
    {{ weeklyRangeLabel }}
  </span>
</div>
        <!-- MONTHLY month picker -->
        <input v-if="currentType === 'MONTHLY'" type="month" v-model="selectedMonth" @change="fetchWithSelectedPeriod"
          class="date-input" />
      </div>
    </div>

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
    <section class="dashboard-grid">
      <!-- Revenue -->
      <div class="card chart-card ">
        <div class="card-header">
          <h3>Revenue Trend</h3>
        </div>
        <div class="chart-box">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Profit -->
      <div class="card chart-card ">
        <div class="card-header">
          <h3>Profit Trend</h3>
        </div>
        <div class="chart-box">
          <Line :data="profitChartData" :options="profitChartOptions" />
        </div>
      </div>

      <!-- Top Items -->
      <div class="card chart-card ">
        <div class="card-header">
          <h3>
  Top 5 Best-Selling Items
  <span class="period-label">({{ periodLabel }})</span>
</h3>
        </div>
        <div class="chart-box">
          <Bar :data="topItemsChartData" :options="topItemsChartOptions" />
        </div>
      </div>

      <!-- Category -->
      <div class="card chart-card ">
        <div class="card-header">
          <h3>
  Number of items sold by category
  <span class="period-label">({{ periodLabel }})</span>
</h3>
        </div>

        <div v-if="dashboardStore.categoryChart.length === 0" class="empty-chart">
          No data
        </div>

        <div v-else class="chart-box">
          <Bar :data="categoryChartData" :options="categoryChartOptions" />
        </div>
      </div>
    </section>
    <!-- <section class="middle-grid">
      <div class="revenue-filter">
        <div class="chart-header">
          <h3>Revenue Trend</h3>
        </div>
        <div class="chart-wrapper">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="revenue-filter">
        <div class="chart-header">
          <h3>Profit Trend</h3>
        </div>
        <div class="chart-wrapper">
          <Line :data="profitChartData" :options="profitChartOptions" />
        </div>
      </div>

      <div class="revenue-filter">
        <div class="chart-header">
          <h3>Top 5 Best-Selling Items</h3>
        </div>
        <div class="chart-wrapper">
          <Bar :data="topItemsChartData" :options="topItemsChartOptions" />
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
    </section> -->
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
  // await dashboardStore.fetchDashboard()
  await fetchWithSelectedPeriod()
  await dashboardStore.fetchTopItems(currentType.value, currentType.value === 'DAILY' ? selectedDate.value : selectedMonth.value)
})

const dashboard = computed(() => dashboardStore.dashboard)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const selectedWeek = ref(new Date().toISOString().split('T')[0])

const categoryChartData = computed(() => {
  const sorted = [...dashboardStore.categoryChart].sort((a, b) => b.orderCount - a.orderCount)

  return {
    labels: sorted.map((p) => p.categoryName),
    datasets: [
      {
        label: 'Number of items',
        data: sorted.map((p) => p.orderCount),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
    ],
  }
})


const currentType = ref<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY')

function changeType(type: 'DAILY' | 'WEEKLY' | 'MONTHLY') {
  currentType.value = type
  fetchWithSelectedPeriod()
}


function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return d
}

function onWeekChange() {
  if (!selectedWeek.value) return

  const date = new Date(selectedWeek.value)

  const monday = getMonday(date)

  // 🔥 force input to always be Monday
  selectedWeek.value = monday.toISOString().split('T')[0]

  fetchWithSelectedPeriod()
}
const weeklyRangeLabel = computed(() => {
  if (currentType.value !== 'WEEKLY') return ''

  const monday = getMonday(new Date(selectedWeek.value))

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const format = (d: Date) =>
    d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    })

  return `${format(monday)} – ${format(sunday)}`
})

const kpiCards = computed(() => {
  if (!dashboard.value) return []

  const isDaily = currentType.value === 'DAILY'
  const isWeekly = currentType.value === 'WEEKLY'

  return [
    {
      label: isDaily
        ? "Today's orders"
        : isWeekly
        ? "This week's orders"
        : "This month's orders",

      value: dashboard.value.todayOrders,

      subtext: isDaily
        ? `vs. ${dashboard.value.yesterdayOrders} yesterday`
        : isWeekly
        ? `vs. ${dashboard.value.yesterdayOrders} last week`
        : `vs. ${dashboard.value.yesterdayOrders} last month`,
    },
    {
      label: 'Profit (฿)',
      value: `฿${dashboard.value.todayProfitBaht.toLocaleString()}`,
      subtext: 'Today gross profit',
    },
    {
      label: 'Total Sales (฿)',
      value: `฿${dashboard.value.totalSales?.toLocaleString() || 0}`,
      subtext:
        currentType.value === 'DAILY'
          ? 'Total sales today'
          : 'Total sales this period',
    },
    {
      label: 'Active tables',
      value: dashboard.value.activeTables,
      subtext: `Out of ${dashboard.value.totalTables} tables`,
    },
  ]
})

const topItemsChartData = computed(() => {
  return {
    labels: dashboardStore.topItems.map(i => i.name),
    datasets: [
      {
        label: 'Top Items',
        data: dashboardStore.topItems.map(i => i.quantity),
        backgroundColor: '#f97316',
        borderRadius: 8,
      },
    ],
  }
})

const topItemsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
}

function formatWeekRange(dateStr: string) {
  const date = new Date(dateStr)

  const monday = new Date(date)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const format = (d: Date) =>
    d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    })

  return `${format(monday)}–${format(sunday)}`
}

const chartData = computed(() => ({
  labels: dashboardStore.revenueChart.map((p) =>
  currentType.value === 'WEEKLY'
    ? formatWeekRange(p.date)
    : new Date(p.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })
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
        text:
  currentType.value === 'DAILY'
    ? 'Date'
    : currentType.value === 'WEEKLY'
    ? 'Week'
    : 'Month',
        // text: currentType.value === 'DAILY' ? 'Date' : 'Month',
      },
    },
  },
}))

const profitChartData = computed(() => ({
  labels: dashboardStore.profitChart.map((p) =>
  currentType.value === 'WEEKLY'
    ? formatWeekRange(p.date)
    : new Date(p.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })
),
  datasets: [
    {
      label: 'Profit (฿)',
      data: dashboardStore.profitChart.map((p) => p.revenue),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
}))

const profitChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Profit (฿)',
      },
      beginAtZero: true,
    },
    x: {
      title: {
        display: true,
        text:
  currentType.value === 'DAILY'
    ? 'Date'
    : currentType.value === 'WEEKLY'
    ? 'Week'
    : 'Month',
        // text: currentType.value === 'DAILY' ? 'Date' : 'Month',
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
  let period = ''

  if (currentType.value === 'DAILY') {
    period = selectedDate.value
  } else if (currentType.value === 'WEEKLY') {
    period = selectedWeek.value
    // period = selectedWeek.value.toISOString().split('T')[0]
    // period = weekStart.value
  } else {
    period = selectedMonth.value
  }

  await dashboardStore.fetchDashboard(currentType.value, period)
  await dashboardStore.fetchRevenue(currentType.value, period)
  await dashboardStore.fetchProfit(currentType.value, period)
  await dashboardStore.fetchCategoryOrders(currentType.value, period)
  await dashboardStore.fetchTopItems(currentType.value, period)
}

const periodLabel = computed(() => {
  if (currentType.value === 'DAILY') {
    const d = new Date(selectedDate.value)
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (currentType.value === 'WEEKLY') {
    const date = new Date(selectedWeek.value)

    const day = date.getDay()
    const diff = (day === 0 ? -6 : 1 - day)

    const monday = new Date(date)
    monday.setDate(date.getDate() + diff)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const format = (d: Date) =>
      d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })

    return `${format(monday)} – ${format(sunday)}`
  }

  // MONTHLY
  const [year, month] = selectedMonth.value.split('-')
  const d = new Date(Number(year), Number(month) - 1)

  return d.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
})

// async function fetchWithSelectedPeriod() {
//   if (currentType.value === 'DAILY') {
//     await dashboardStore.fetchDashboard('DAILY', selectedDate.value)
//     await dashboardStore.fetchRevenue('DAILY', selectedDate.value)
//     await dashboardStore.fetchProfit('DAILY', selectedDate.value)
//     await dashboardStore.fetchCategoryOrders('DAILY', selectedDate.value)
//     await dashboardStore.fetchTopItems('DAILY', selectedDate.value)
//   } else {
//     await dashboardStore.fetchDashboard('MONTHLY', selectedMonth.value)
//     await dashboardStore.fetchRevenue('MONTHLY', selectedMonth.value)
//     await dashboardStore.fetchProfit('MONTHLY', selectedMonth.value)
//     await dashboardStore.fetchCategoryOrders('MONTHLY', selectedMonth.value)
//     await dashboardStore.fetchTopItems('MONTHLY', selectedMonth.value)
//   }
// }
</script>
<style scoped src="@/styles/admin/dashboard.css"></style>
