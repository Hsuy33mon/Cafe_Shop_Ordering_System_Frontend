import { defineStore } from 'pinia'

type OrderSessionState = {
  customerName: string
  tableNumber: string // keep as string to support "A12", "T-03", etc.
}

const STORAGE_KEY = 'cafeshop_order_session_v1'

export const useOrderSessionStore = defineStore('orderSession', {
  state: (): OrderSessionState => ({
    customerName: '',
    tableNumber: '',
  }),

  getters: {
    isReady: (s) => Boolean(s.customerName.trim()) && Boolean(s.tableNumber.trim()),
  },

  actions: {
    setSession(payload: { customerName: string; tableNumber: string }) {
      this.customerName = payload.customerName.trim()
      this.tableNumber = payload.tableNumber.trim()
      this.persist()
    },

    clear() {
      this.customerName = ''
      this.tableNumber = ''
      localStorage.removeItem(STORAGE_KEY)
    },

    hydrate() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const data = JSON.parse(raw)
        this.customerName = String(data.customerName ?? '')
        this.tableNumber = String(data.tableNumber ?? '')
      } catch {
        // ignore invalid storage
      }
    },

    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          customerName: this.customerName,
          tableNumber: this.tableNumber,
        }),
      )
    },
  },
})
