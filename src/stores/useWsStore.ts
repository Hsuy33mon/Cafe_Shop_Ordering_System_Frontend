// src/stores/useWsStore.ts
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
  return `${baseUrl.replace(/\/$/, '')}${wsPath.startsWith('/') ? '' : '/'}${wsPath}`
}

export const useWsStore = defineStore('ws', {
  state: () => ({
    client: null as Client | null,
    connected: false,

    newOrderIds: [] as number[],
    lastPaymentEvent: null as PaymentUpdateEvent | null,

    // ✅ queue payment subscriptions until connected
    pendingPaymentSubs: new Map<number, (evt: PaymentUpdateEvent) => void>(),
    subscribedPaymentIds: new Set<number>(),
  }),

  actions: {
    connect() {
      if (this.client?.active) return

      // ⚠️ IMPORTANT: baseUrl must be backend ROOT, not /api
      // Example: https://cafe-shop-backend...herokuapp.com
      const baseUrl = import.meta.env.VITE_WS_BASE_URL || import.meta.env.VITE_API_BASE_URL
      const wsPath = (import.meta.env.VITE_WS_PATH as string) || '/ws'
      const wsUrl = toWsUrl(baseUrl as string, wsPath)

      const client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 5000,

        // ✅ add debug to see if connected/subscribed
        debug: (s) => console.log('[WS]', s),
      })

      client.onConnect = () => {
        console.log('[WS] CONNECTED ✅')
        this.connected = true

        // global topic
        client.subscribe('/topic/orders/payment', (msg) => {
          const evt = JSON.parse(msg.body) as PaymentUpdateEvent
          const ids = (evt.orderIds ?? []).map(Number).filter(Boolean)
          if (!ids.length) return

          const set = new Set(this.newOrderIds)
          ids.forEach((id) => set.add(id))
          this.newOrderIds = Array.from(set)
        })

        // ✅ process queued payment subscriptions
        for (const [paymentId, cb] of this.pendingPaymentSubs.entries()) {
          this._subscribePaymentNow(paymentId, cb)
        }
        this.pendingPaymentSubs.clear()
      }

      client.onStompError = (frame) => {
        console.error('[WS] STOMP ERROR ❌', frame.headers, frame.body)
      }
      client.onWebSocketError = (e) => {
        console.error('[WS] WS ERROR ❌', e)
      }
      client.onWebSocketClose = (e) => {
        console.warn('[WS] WS CLOSED', e)
        this.connected = false
        this.subscribedPaymentIds.clear()
      }

      client.activate()
      this.client = client
    },

    // internal real subscribe (only called when connected)
    _subscribePaymentNow(paymentId: number, onEvent?: (evt: PaymentUpdateEvent) => void) {
      if (!this.client || !this.connected) return
      if (this.subscribedPaymentIds.has(paymentId)) return

      console.log('[WS] Subscribing to', `/topic/payments/${paymentId}`)
      this.subscribedPaymentIds.add(paymentId)

      this.client.subscribe(`/topic/payments/${paymentId}`, (msg) => {
        const evt = JSON.parse(msg.body) as PaymentUpdateEvent
        console.log('[WS] Payment event received ✅', evt)
        this.lastPaymentEvent = evt
        onEvent?.(evt)
      })
    },

    subscribePayment(paymentId: number, onEvent?: (evt: PaymentUpdateEvent) => void) {
      if (!paymentId) return

      // ✅ if not connected yet, queue it
      if (!this.client || !this.connected) {
        this.pendingPaymentSubs.set(paymentId, onEvent ?? (() => {}))
        this.connect()
        console.log('[WS] queued subscription (not connected yet):', paymentId)
        return
      }

      this._subscribePaymentNow(paymentId, onEvent)
    },

    disconnect() {
      this.client?.deactivate()
      this.client = null
      this.connected = false
      this.lastPaymentEvent = null
      this.newOrderIds = []
      this.pendingPaymentSubs.clear()
      this.subscribedPaymentIds.clear()
    },
  },
})
