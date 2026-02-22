import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export interface DashboardResponse {
  todayOrders: number
  yesterdayOrders: number
  orderGrowthPercent: number

  todayProfitBaht: number
  profitGrowthPercent: number

  activeTables: number
  totalTables: number

  popularItemName: string
  popularItemCount: number

  recentOrders?: any[]
  channelStats?: any[]
  topCategories?: any[]
}

export type RevenuePoint = {
  label: string
  revenue: number
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboard: null,
    revenueChart: [] as RevenuePoint[],
    loading: false
  }),

  actions: {
    async fetchDashboard() {
      try {
        this.loading = true
        const res = await http.get('/api/admin/dashboard')
        this.dashboard = res.data
      } catch (err) {
        console.error('Failed to fetch dashboard', err)
      } finally {
        this.loading = false
      }
    },

    async fetchRevenue(type: 'WEEKLY' | 'MONTHLY') {
      const res = await http.get('/api/admin/dashboard/revenue', {
        params: { type },
      })
      this.revenueChart = res.data
    },
  },
})

