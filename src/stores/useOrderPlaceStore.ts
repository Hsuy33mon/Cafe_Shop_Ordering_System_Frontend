import { defineStore } from 'pinia'
import { http } from '@/lib/http'
import type { Order } from './useOrderStore'

export type OrderPlaceStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'

export type OrderPlacePayload = {
  no: string
  type: string
  seat?: number
  status: OrderPlaceStatus
  description?: string
}

export type UpdateOrderPlacePayload = OrderPlacePayload
export type CreateOrderPlacePayload = OrderPlacePayload

export type OrderPlace = {
  id: number
  no: string
  type: string
  description?: string
  seat?: number
  status: OrderPlaceStatus
  activeOrders: Order[]
  qrValue?: string
  qrUrl?: string
  qrPng?: string
}

function mapFromApi(x: any): OrderPlace {
  return {
    id: Number(x.id),
    no: x.no,
    type: x.type,
    description: x.description,
    seat: x.seat != null ? Number(x.seat) : undefined,
    status: x.status,
    activeOrders: Array.isArray(x.activeOrders) ? x.activeOrders : [],
    qrValue: x.qrValue,
    qrUrl: x.qrUrl,
    qrPng: x.qrPng,
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
    async fetchByNo(no: string) {
      this.loading = true
      this.error = null

      try {
        const res = await http.get(`/api/admin/order-places/tableNumber/${encodeURIComponent(no)}`)
        return res.data ? mapFromApi(res.data) : null
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        return null
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

    async createOrderPlace(payload: CreateOrderPlacePayload) {
      this.loading = true
      this.error = null

      try {
        const res = await http.post('/api/admin/order-places', payload)
        const created = mapFromApi(res.data)

        this.items.unshift(created)
        return created
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateOrderPlace(id: number, payload: UpdateOrderPlacePayload) {
      this.loading = true
      this.error = null

      try {
        const res = await http.put(`/api/admin/order-places/${id}`, payload)
        const updated = mapFromApi(res.data)

        const index = this.items.findIndex((i) => i.id === id)
        if (index !== -1) {
          this.items[index] = {
            ...this.items[index],
            ...updated,
            activeOrders: this.items[index].activeOrders,
          }
        }

        return updated
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteOrderPlace(id: number) {
      this.loading = true
      this.error = null

      try {
        await http.delete(`/api/admin/order-places/${id}`)
        this.items = this.items.filter((i) => i.id !== id)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
