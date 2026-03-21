import { defineStore } from 'pinia'

export type OrderType = 'TABLE' | 'ROOM'

type OrderSessionState = {
  customerName: string
  orderType: OrderType
  placeNumber: string
  tableNumber?: string
  orderPlaceId: number | null
}

const STORAGE_KEY = 'cafeshop_order_session_v2'

export const useOrderSessionStore = defineStore('orderSession', {
  state: (): OrderSessionState => ({
    customerName: '',
    orderType: 'TABLE',
    placeNumber: '',
    tableNumber: '',
    orderPlaceId: null,
  }),

  getters: {
    isReady: (s) =>
      Boolean(s.customerName.trim()) &&
      Boolean((s.placeNumber || s.tableNumber || '').trim()) &&
      Boolean(s.orderPlaceId) &&
      (s.orderType === 'TABLE' || s.orderType === 'ROOM'),
  },

  actions: {
    setSession(payload: {
      customerName: string
      orderType: OrderType
      placeNumber: string
      orderPlaceId: number
    }) {
      this.customerName = payload.customerName.trim()
      this.orderType = payload.orderType
      this.placeNumber = payload.placeNumber.trim()
      this.tableNumber = this.placeNumber
      this.orderPlaceId = payload.orderPlaceId

      this.persist()
    },

    clear() {
      this.customerName = ''
      this.orderType = 'TABLE'
      this.placeNumber = ''
      this.tableNumber = ''
      this.orderPlaceId = null
      localStorage.removeItem(STORAGE_KEY)
    },

    hydrate() {
      const raw = localStorage.getItem(STORAGE_KEY)
      const rawOld = raw ? null : localStorage.getItem('cafeshop_order_session_v1')
      const source = raw ?? rawOld
      if (!source) return

      try {
        const data = JSON.parse(source)
        this.customerName = String(data.customerName ?? '')

        const t = String(data.orderType ?? '').toUpperCase()
        this.orderType = t === 'ROOM' ? 'ROOM' : 'TABLE'

        const pn = data.placeNumber ?? data.tableNumber ?? ''
        this.placeNumber = String(pn)
        this.tableNumber = String(data.tableNumber ?? this.placeNumber ?? '')

        this.orderPlaceId =
          data.orderPlaceId !== undefined && data.orderPlaceId !== null
            ? Number(data.orderPlaceId)
            : null
      } catch {
        this.clear()
      }
    },

    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          customerName: this.customerName,
          orderType: this.orderType,
          placeNumber: this.placeNumber,
          tableNumber: this.placeNumber,
          orderPlaceId: this.orderPlaceId,
        }),
      )
    },
  },
})
