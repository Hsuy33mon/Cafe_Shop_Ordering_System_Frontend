import { defineStore } from 'pinia'
import { http } from '@/lib/http'
import type { Order } from './useOrderStore'

export type OrderPlaceStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'
  
export type OrderPlace = {
  id: number
  no: string
  type: string
  description?: string
  seat?: number
  status: OrderPlaceStatus
  activeOrders: Order[]
}

function mapFromApi(x: any): OrderPlace {
  return {
    id: Number(x.id),
    no: x.no,
    type: x.type,
    description: x.description,
    seat: x.seat,
    status: x.status,
    activeOrders: Array.isArray(x.activeOrders) ? x.activeOrders : [],
  }
}

function axiosErrorMessage(e: any): string {
  const data = e?.response?.data
  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === 'string' ? data : null) ||
    e?.message ||
    'Request failed'
  )
}

export const useOrderPlacesStore = defineStore('orderPlaces', {
  state: () => ({
    items: [] as OrderPlace[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const res = await http.get('/api/admin/order-places')
        this.items = Array.isArray(res.data) ? res.data.map(mapFromApi) : []
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async fetchWithCurrentOrders() {
      this.loading = true
      this.error = null
      try {
        const res = await http.get('/api/admin/order-places/with-current-order')
        this.items = Array.isArray(res.data) ? res.data.map(mapFromApi) : []
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },
  },
})
