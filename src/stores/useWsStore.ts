import { defineStore } from 'pinia'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

type PaymentUpdateEvent = {
  invoiceId?: number
  paymentId?: number
  paymentStatus?: string
  paymentType?: string
  orderIds?: number[]
}

function toWsUrl(baseUrl: string, wsPath: string) {
  // SockJS endpoint must be http(s), not ws(s)
  return `${baseUrl.replace(/\/$/, '')}${wsPath.startsWith('/') ? '' : '/'}${wsPath}`
}

export const useWsStore = defineStore('ws', {
  state: () => ({
    client: null as Client | null,
    connected: false,
    newOrderIds: [] as number[], 
  }),

  getters: {
    hasNewOrders: (s) => s.newOrderIds.length > 0,
    newOrderCount: (s) => s.newOrderIds.length,
    newOrderIdSet: (s) => new Set(s.newOrderIds),
  },

  actions: {
    connect() {
      if (this.client?.active) return

      const baseUrl = import.meta.env.VITE_API_BASE_URL as string
      const wsPath = (import.meta.env.VITE_WS_PATH as string) || '/ws'
      const wsUrl = toWsUrl(baseUrl, wsPath)

      const client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 5000,
      })

      client.onConnect = () => {
        this.connected = true
        client.subscribe('/topic/orders/payment', (msg) => {
          const evt = JSON.parse(msg.body) as PaymentUpdateEvent
          const ids = (evt.orderIds ?? []).map((x) => Number(x)).filter(Boolean)

          if (!ids.length) return

          // dedupe
          const set = new Set(this.newOrderIds)
          ids.forEach((id) => set.add(id))
          this.newOrderIds = Array.from(set)
        })
      }

      client.onDisconnect = () => {
        this.connected = false
      }

      client.activate()
      this.client = client
    },

    disconnect() {
      this.client?.deactivate()
      this.client = null
      this.connected = false
    },

    clearNewOrders() {
      this.newOrderIds = []
    },
  },
})