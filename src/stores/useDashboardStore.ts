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

  totalSales: number
  previousSales: number
  salesGrowthPercent: number

  recentOrders?: any[]
  channelStats?: any[]
  topCategories?: any[]
}

export type RevenuePoint = {
  date: string
  revenue: number
}

export type ProfitPoint = {
  date: string
  revenue: number
}

export type CategoryOrderPoint = {
  categoryName: string
  orderCount: number
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboard: null,
    revenueChart: [] as RevenuePoint[],
    profitChart: [] as ProfitPoint[],
    categoryChart: [] as CategoryOrderPoint[],
    topItems: [] as { name: string; quantity: number }[],
    loading: false,
  }),

  actions: {
    async fetchDashboard(type: 'DAILY' | 'WEEKLY' | 'MONTHLY', period?: string) {
      try {
        this.loading = true

        const res = await http.get('/api/admin/dashboard', {
          params: { type, period },
        })

        this.dashboard = res.data
      } catch (err) {
        console.error('Failed to fetch dashboard', err)
      } finally {
        this.loading = false
      }
    },
    async fetchRevenue(type: 'DAILY' | 'WEEKLY' | 'MONTHLY', period?: string) {
      const res = await http.get('/api/admin/dashboard/revenue', {
        params: { type, period },
      })
      this.revenueChart = res.data
    },
    async fetchProfit(type: 'DAILY' | 'WEEKLY' | 'MONTHLY', period?: string) {
      const res = await http.get('/api/admin/dashboard/profit', {
        params: { type, period },
      })
      this.profitChart = res.data
    },
    async fetchTopItems(type: 'DAILY' | 'WEEKLY' | 'MONTHLY', period?: string) {
      const res = await http.get('/api/admin/dashboard/top-items', {
        params: { type, period },
      })
      this.topItems = res.data
    },
    async fetchCategoryOrders(type: 'DAILY' | 'WEEKLY' | 'MONTHLY', period?: string) {
      const res = await http.get('/api/admin/dashboard/category-orders', {
        params: { type, period },
      })
      this.categoryChart = res.data
    },
  },
})
