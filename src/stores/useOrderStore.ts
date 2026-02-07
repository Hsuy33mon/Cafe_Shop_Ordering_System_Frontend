import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED'

export type OrderItem = {
  name: string
  size?: string
  quantity: number
  unitPrice: number
  total: number
  note?: string
  orderIngredients?: OrderIngredient[]
}

export type OrderIngredient = {
  id: number
  ingredientId: number
  ingredientName: string
  qty: number
  note?: string | null
}

export type Order = {
  id: number
  orderPlaceId: number | null
  tableNo: string | null
  date: string
  time: string
  customer: string
  channel: 'Cafe' | 'Room' | 'Take-away'
  status: OrderStatus
  paymentStatus: string
  customerNote?: string
  items: OrderItem[]
  subtotal: number
  serviceCharge: number
  tax: number
  total: number
}

function mapFromApi(x: any): Order {
  const created = new Date(x.createdAt)

  return {
    id: Number(x.id),
    orderPlaceId: x.orderPlaceId != null ? Number(x.orderPlaceId) : null,
    // orderPlaceId: x.orderPlaceId != null? Number(x.orderPlaceId): x.orderPlace?.id != null? Number(x.orderPlace.id): null,
    tableNo: x.orderPlace?.no ?? null,
    date: created.toISOString().slice(0, 10),
    time: created.toTimeString().slice(0, 5),
    customer: x.customerName,
    channel: 'Cafe',
    status: x.status,
    paymentStatus: x.paymentStatus ?? 'UNPAID',
    customerNote: x.note,
    items: [
      {
        name: x.menuItem?.name ?? 'Unknown item',
        size: x.size?.shortName ?? x.size?.name ?? null,
        quantity: x.qty,
        unitPrice: Number(x.unitPrice),
        total: Number(x.totalPrice),
        note: x.note,
        orderIngredients: Array.isArray(x.orderIngredients) ? x.orderIngredients.map((oi: any) => ({
          id: oi.id,
          ingredientId: oi.ingredientId,
          ingredientName: oi.ingredientName,
          qty: Number(oi.qty),
          note: oi.note,
        }))
      : [],
      },
    ],
    subtotal: Number(x.totalPrice),
    serviceCharge: 0,
    tax: 0,
    total: Number(x.totalPrice),
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

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [] as Order[],
    currentOrder: null as Order | null,
    loading: false,
    error: null as string | null,
    lastLoadedAt: null as string | null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const res = await http.get('/api/admin/orders')
        this.items = Array.isArray(res.data) ? res.data.map(mapFromApi) : []
        this.lastLoadedAt = new Date().toISOString()
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await http.get(`/api/admin/orders/${id}`)
        this.currentOrder = mapFromApi(res.data)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },
    async updateOrderItem(orderId: number, itemId: number, payload: any) {
  await http.put(`/api/admin/orders/${orderId}/items/${itemId}`, payload)
},
async update(
  id: number,
  payload: {
    status?: OrderStatus
    paymentStatus?: string
    paymentType?: string
  },
) {
  this.loading = true
  this.error = null
  try {
    const res = await http.put(`/api/admin/orders/${id}`, payload)

    const updated = mapFromApi(res.data)

    const idx = this.items.findIndex((x) => x.id === id)
    if (idx !== -1) this.items[idx] = updated
    if (this.currentOrder?.id === id) this.currentOrder = updated

    return res.data
  } catch (e: any) {
    this.error = axiosErrorMessage(e)
    throw e
  } finally {
    this.loading = false
  }
},


    // async update(id: number, payload: { status?: OrderStatus }) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     const res = await http.put(`/api/admin/orders/${id}`, payload)

    //     const updated = mapFromApi(res.data)
    //     const idx = this.items.findIndex((x) => x.id === id)
    //     if (idx !== -1) this.items[idx] = updated
    //     if (this.currentOrder?.id === id) this.currentOrder = updated

    //     return res.data
    //   } catch (e: any) {
    //     this.error = axiosErrorMessage(e)
    //     throw e
    //   } finally {
    //     this.loading = false
    //   }
    // },

    async remove(id: number) {
      this.loading = true
      this.error = null
      try {
        await http.delete(`/api/admin/orders/${id}`)
        this.items = this.items.filter((x) => x.id !== id)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
