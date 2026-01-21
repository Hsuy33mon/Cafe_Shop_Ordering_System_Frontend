import { defineStore } from 'pinia'

export type OrderType = 'TABLE' | 'ROOM'

type OrderSessionState = {
  customerName: string

  // NEW
  orderType: OrderType
  placeNumber: string // table/room number (string supports A12, R-03, etc.)

  // OLD (keep for backward compatibility only)
  tableNumber?: string
}

const STORAGE_KEY = 'cafeshop_order_session_v2'

export const useOrderSessionStore = defineStore('orderSession', {
  state: (): OrderSessionState => ({
    customerName: '',
    orderType: 'TABLE',
    placeNumber: '',
    tableNumber: '',
  }),

  getters: {
    isReady: (s) =>
      Boolean(s.customerName.trim()) &&
      Boolean((s.placeNumber || s.tableNumber || '').trim()) &&
      (s.orderType === 'TABLE' || s.orderType === 'ROOM'),
  },

  actions: {
    setSession(payload: { customerName: string; orderType: OrderType; placeNumber: string }) {
      this.customerName = payload.customerName.trim()
      this.orderType = payload.orderType
      this.placeNumber = payload.placeNumber.trim()

      // keep old field updated too (optional, helps older pages)
      this.tableNumber = this.placeNumber

      this.persist()
    },

    clear() {
      this.customerName = ''
      this.orderType = 'TABLE'
      this.placeNumber = ''
      this.tableNumber = ''
      localStorage.removeItem(STORAGE_KEY)
    },

    hydrate() {
      const raw = localStorage.getItem(STORAGE_KEY)

      // If new key not found, try old key (so users don’t lose session)
      const rawOld = raw ? null : localStorage.getItem('cafeshop_order_session_v1')
      const source = raw ?? rawOld
      if (!source) return

      try {
        const data = JSON.parse(source)

        this.customerName = String(data.customerName ?? '')

        // orderType
        const t = String(data.orderType ?? '').toUpperCase()
        this.orderType = t === 'ROOM' ? 'ROOM' : 'TABLE'

        // placeNumber (new) or tableNumber (old)
        const pn = data.placeNumber ?? data.tableNumber ?? ''
        this.placeNumber = String(pn)

        // keep old
        this.tableNumber = String(data.tableNumber ?? this.placeNumber ?? '')
      } catch {
        // ignore invalid storage
      }
    },

    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          customerName: this.customerName,
          orderType: this.orderType,
          placeNumber: this.placeNumber,
          // optional: also store tableNumber for compatibility
          tableNumber: this.placeNumber,
        }),
      )
    },
  },
})
