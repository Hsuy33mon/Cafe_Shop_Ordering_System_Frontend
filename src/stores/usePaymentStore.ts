import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useCartStore } from './useCartStore'
import { http } from '@/lib/http'
export type PaymentMethod = 'PROMPTPAY_QR' | 'CARD' | 'CASH'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED'

/** Backend response (based on your sample) */
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

export type OrderIngredientRequest = {
  ingredientId: number
  qty: number
}

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

export const usePaymentStore = defineStore('payment', () => {
  // state
  const selectedMethod = ref<PaymentMethod>('PROMPTPAY_QR')
  const payment = ref<PaymentResponse | null>(null)

  const loading = ref(false)
  const error = ref<string>('')

  // if you want to show countdown in UI
  const expiresInSec = ref(300)

  const expiresInText = computed(() => {
    const m = Math.floor(expiresInSec.value / 60)
    const s = expiresInSec.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  /** Build request body from CartStore */
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
      amount: cart.totalPrice,
      items: cart.items.map((i: any) => ({
        qty: i.quantity,
        menuItemSizeId: i.sizeId ?? i.menuItemSizeId, // support both keys
        note: i.note ?? '',
        status: 'PENDING',
        ingredients: (i.ingredients ?? []).map((ing: any) => ({
          ingredientId: ing.id ?? ing.ingredientId,
          qty: ing.qty ?? 1,
        })),
      })),
    }
  }

  /** Create payment (PromptPay QR / Card / Cash) */
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
      const res = await http.post<PaymentResponse>('/payments', body)

      payment.value = res.data
      expiresInSec.value = 300
      return res.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Create payment failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  /** Refresh QR (create new payment or regenerate) */
  async function refreshQr(payload: {
    orderPlaceId: number
    customerName: string
    promptPayId: string
  }) {
    return createPayment({
      ...payload,
      method: 'PROMPTPAY_QR',
      gateway: 'OMISE',
    })
  }

  /** Optional: Check status (if you have endpoint) */
  async function fetchPaymentById(id: number) {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.get<PaymentResponse>(`/api/payments/${id}`)
      payment.value = res.data
      return res.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Fetch payment failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearPayment() {
    payment.value = null
    error.value = ''
    expiresInSec.value = 300
  }

  return {
    // state
    selectedMethod,
    payment,
    loading,
    error,
    expiresInSec,
    expiresInText,

    // actions
    createPayment,
    refreshQr,
    fetchPaymentById,
    clearPayment,
  }
})
