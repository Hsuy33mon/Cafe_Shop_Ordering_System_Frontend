import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useCartStore } from './useCartStore'
import { http } from '@/lib/http'

export type PaymentMethod = 'PROMPTPAY_QR' | 'CARD' | 'CASH'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED'

export type PaymentResponse = {
  id: number
  orderPlaceId: number
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  gateway: string
  gatewayPaymentId: string
  referenceNo: string
  qrPayload: string | null
  qrImageUrl: string | null
  createdAt: string
  updatedAt: string
  paidAt: string | null
  invoiceId: number
  invoiceNo: string | null
  customerName: string
  invoiceStatus: string
  subTotal: number
  tax: number
  deliveryFee: number
  grandTotal: number
  appliedAt: string
  items: any[] | null
}

export type OrderIngredientRequest = { ingredientId: number; qty: number }
export type OrderRequest = {
  qty: number
  menuItemSizeId: number
  note?: string
  status?: string
  ingredients?: OrderIngredientRequest[]
}

export type PaymentCreateRequest = {
  orderPlaceId: number
  customerName: string
  items: OrderRequest[]
  amount?: number
  method: PaymentMethod
  promptPayId?: string
  gateway: string
}

type PersistedPayment = {
  payment: PaymentResponse | null
  expiresAtMs: number | null
  selectedMethod: PaymentMethod
}

const STORAGE_KEY = 'cafeshop_payment_v1'
const DEFAULT_QR_TTL_SEC = 300 // 5 min UI TTL

export const usePaymentStore = defineStore('payment', () => {
  const selectedMethod = ref<PaymentMethod>('PROMPTPAY_QR')
  const payment = ref<PaymentResponse | null>(null)

  // expiration tracking (client-side)
  const expiresAtMs = ref<number | null>(null)
  const expiresInSec = ref(300)

  const loading = ref(false)
  const error = ref('')

  const expiresInText = computed(() => {
    const m = Math.floor(expiresInSec.value / 60)
    const s = expiresInSec.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  // ---------- persistence ----------
  function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const data: PersistedPayment = JSON.parse(raw)
      payment.value = data.payment ?? null
      expiresAtMs.value = data.expiresAtMs ?? null
      selectedMethod.value = data.selectedMethod ?? 'PROMPTPAY_QR'
      syncExpiresIn()
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function saveToStorage() {
    const payload: PersistedPayment = {
      payment: payment.value,
      expiresAtMs: expiresAtMs.value,
      selectedMethod: selectedMethod.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  loadFromStorage()

  watch([payment, expiresAtMs, selectedMethod], saveToStorage, { deep: true })

  function setNewExpiry(ttlSec = DEFAULT_QR_TTL_SEC) {
    expiresAtMs.value = Date.now() + ttlSec * 1000
    syncExpiresIn()
  }

  function syncExpiresIn() {
    if (!expiresAtMs.value) {
      expiresInSec.value = DEFAULT_QR_TTL_SEC
      return
    }
    const diffMs = expiresAtMs.value - Date.now()
    expiresInSec.value = Math.max(0, Math.floor(diffMs / 1000))
  }

  function isCurrentPaymentReusable(payload: {
    orderPlaceId: number
    customerName: string
    method: PaymentMethod
  }) {
    if (!payment.value) return false
    if (payment.value.status !== 'PENDING') return false
    if (payment.value.method !== payload.method) return false
    if (payment.value.orderPlaceId !== payload.orderPlaceId) return false
    if ((payment.value.customerName ?? '').trim() !== (payload.customerName ?? '').trim()) return false
    if (!expiresAtMs.value) return false
    if (Date.now() >= expiresAtMs.value) return false
    return true
  }

  function buildRequestBody(payload: {
    orderPlaceId: number
    customerName: string
    promptPayId?: string
    gateway?: string
    method?: PaymentMethod
  }): PaymentCreateRequest {
    const cart = useCartStore()

    return {
      orderPlaceId: payload.orderPlaceId,
      customerName: payload.customerName,
      method: payload.method ?? selectedMethod.value,
      gateway: payload.gateway ?? 'OMISE',
      promptPayId: payload.promptPayId,
      // optional: backend should compute; okay to send too
      amount: cart.totalPrice,
      items: cart.items.map((i: any) => ({
        qty: i.quantity,
        menuItemSizeId: i.sizeId ?? i.menuItemSizeId,
        note: i.note ?? '',
        status: 'PENDING',
        ingredients: (i.ingredients ?? []).map((ing: any) => ({
          ingredientId: ing.id ?? ing.ingredientId,
          qty: ing.qty ?? 1,
        })),
      })),
    }
  }

  /** ✅ Create NEW payment (only when needed) */
  async function createPayment(payload: {
    orderPlaceId: number
    customerName: string
    promptPayId?: string
    gateway?: string
    method?: PaymentMethod
  }) {
    loading.value = true
    error.value = ''
    try {
      const body = buildRequestBody(payload)
      const res = await http.post<PaymentResponse>('api/payments', body)

      payment.value = res.data
      setNewExpiry(DEFAULT_QR_TTL_SEC)
      return res.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Create payment failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  /** ✅ Ensure we reuse existing payment on refresh */
  async function ensurePromptPayPayment(payload: {
    orderPlaceId: number
    customerName: string
    promptPayId: string
  }) {
    const reusable = isCurrentPaymentReusable({
      orderPlaceId: payload.orderPlaceId,
      customerName: payload.customerName,
      method: 'PROMPTPAY_QR',
    })

    if (reusable) {
      syncExpiresIn()
      return payment.value
    }

    // expired / missing / not reusable → create new
    return createPayment({
      ...payload,
      method: 'PROMPTPAY_QR',
      gateway: 'OMISE',
    })
  }

  /** ✅ Refresh QR = force new payment */
  async function refreshQr(payload: { orderPlaceId: number; customerName: string; promptPayId: string }) {
    // force new
    payment.value = null
    expiresAtMs.value = null
    return createPayment({ ...payload, method: 'PROMPTPAY_QR', gateway: 'OMISE' })
  }

  /** ✅ Use http.get (not axios) */
  async function fetchPaymentById(id: number) {
    loading.value = true
    error.value = ''
    try {
      const res = await http.get<PaymentResponse>(`/payments/${id}`)
      payment.value = res.data
      return res.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Fetch payment failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  /** OPTIONAL: Cancel locally + (if you have backend cancel endpoint) */
  async function cancelPayment() {
    // If you have API: await http.post(`/payments/${payment.value?.id}/cancel`)
    payment.value = null
    expiresAtMs.value = null
    error.value = ''
    expiresInSec.value = DEFAULT_QR_TTL_SEC
    localStorage.removeItem(STORAGE_KEY)
  }

  /** call this every second from UI timer */
  function tick() {
    syncExpiresIn()
    // if expired, mark as canceled locally
    if (expiresInSec.value <= 0 && payment.value?.status === 'PENDING') {
      // you can also call cancelPayment() automatically if you want
      payment.value = { ...payment.value, status: 'CANCELED' }
      saveToStorage()
    }
  }

  function clearPayment() {
    payment.value = null
    expiresAtMs.value = null
    error.value = ''
    expiresInSec.value = DEFAULT_QR_TTL_SEC
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    selectedMethod,
    payment,
    loading,
    error,

    expiresInSec,
    expiresInText,

    createPayment,
    ensurePromptPayPayment,
    refreshQr,
    fetchPaymentById,

    cancelPayment,
    clearPayment,
    tick,
  }
})