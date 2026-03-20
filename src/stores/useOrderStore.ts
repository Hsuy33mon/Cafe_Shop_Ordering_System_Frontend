import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED'

export type OrderIngredient = {
  id: number
  ingredientId: number
  ingredientName: string
  qty: number
  price: number
  note?: string | null
}

export type OrderItem = {
  name: string
  size?: string | null
  quantity: number
  unitPrice: number
  total: number
  note?: string
  orderIngredients?: OrderIngredient[]
  menuItem?: any
}

export type Order = {
  id: number
  orderPlaceId: number | null
  tableNo: string | null
  date: string
  time: string
  customerName: string
  channel: string
  status: OrderStatus
  invoiceId: number | null
  invoicePaymentStatus: string
  customerNote?: string
  items: OrderItem[]
  subtotal: number
  serviceCharge: number
  tax: number
  total: number
}

function mapFromApi(x: any): Order {
  const created = new Date(x.createdAt)

  const orderIngredients: OrderIngredient[] = Array.isArray(x.orderIngredients)
    ? x.orderIngredients.map((oi: any) => ({
      id: Number(oi.id),
      ingredientId: Number(oi.ingredientId),
      ingredientName: oi.ingredientName ?? 'Unknown ingredient',
      qty: Number(oi.qty ?? 0),
      price: Number(oi.price ?? 0),
      note: oi.note ?? null,
    }))
    : []

  const baseUnitPrice = Number(x.menuItemSize?.sellPrice ?? x.unitPrice ?? 0)
  const ingredientTotal = orderIngredients.reduce(
    (sum, ing) => sum + Number(ing.price ?? 0) * Number(ing.qty ?? 0),
    0,
  )

  const finalUnitPrice = Number(x.unitPrice ?? baseUnitPrice + ingredientTotal)
  const quantity = Number(x.qty ?? 0)
  const lineTotal = Number(x.totalPrice ?? finalUnitPrice * quantity)

  return {
    id: Number(x.id),
    orderPlaceId: x.orderPlaceId != null ? Number(x.orderPlaceId) : null,
    tableNo: x.orderPlace?.no ?? null,
    date: created.toISOString().slice(0, 10),
    time: created.toTimeString().slice(0, 5),
    customerName: x.customerName ?? '-',
    channel: x.orderPlace?.type?.toUpperCase() ?? 'TABLE',
    status: x.status,
    invoiceId: Number(x.invoiceId ?? 0),
    // invoiceId: x.invoice.id != null ? Number(x.invoice.id) : null,
    invoicePaymentStatus: x.invoicePaymentStatus ?? '--',
    customerNote: x.note,
    items: [
      {
        name: x.menuItem?.name ?? 'Unknown item',
        size: x.size?.shortName ?? x.size?.name ?? null,
        quantity,
        unitPrice: finalUnitPrice,
        total: lineTotal,
        note: x.note,
        menuItem: x.menuItem,
        orderIngredients,
      },
    ],
    subtotal: lineTotal,
    serviceCharge: 0,
    tax: 0,
    total: lineTotal,
  }
}

function mapCustomerOrder(x: any): Order {
  const created = new Date(x.createdAt)

  return {
    id: Number(x.orderId),

    orderPlaceId: null,
    tableNo: x.tableNo ?? null,
    channel: x.orderType ?? 'TABLE',

    date: created.toISOString().slice(0, 10),
    time: created.toTimeString().slice(0, 5),

    customerName: '-',

    status: x.status,

    invoiceId: Number(x.invoiceId),
    invoicePaymentStatus: '--',

    items: [
      {
        name: x.menuItemName,
        size: x.sizeName,
        quantity: Number(x.qty),
        unitPrice: Number(x.unitPrice),
        total: Number(x.lineTotal),
      },
    ],

    subtotal: Number(x.lineTotal),
    serviceCharge: 0,
    tax: 0,
    total: Number(x.lineTotal),
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
        const res = await http.get('/api/admin/orders', { skipAuth: true })
        this.items = Array.isArray(res.data) ? res.data.map(mapFromApi) : []
        this.lastLoadedAt = new Date().toISOString()
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },
    async fetchByInvoice(invoiceId: number) {
      try {
        const res = await http.get(`/api/customer/orders/${invoiceId}`, {
          skipAuth: true
        })

        // this.items = Array.isArray(res.data)
        //   ? res.data.map(mapCustomerOrder)
        //   : []

          const newItems = res.data.map(mapCustomerOrder)

          this.items.push(...newItems)
      } catch (e) {
        console.error('Fetch by invoice failed', e)
      }
    },
    async fetchById(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await http.get(`/api/admin/orders/${id}`, { skipAuth: true })
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
