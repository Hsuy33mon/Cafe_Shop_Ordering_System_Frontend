<template>
  <div class="payment-page">
    <!-- HEADER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Scan to Pay</h1>

        <div class="breadcrumb-pill">
          <span class="crumb crumb--link" @click="goToHome"> Home </span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--link" @click="goToCheckout"> Checkout </span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Scan Pay</span>
        </div>
      </div>
    </section>

    <!-- MAIN -->
    <main class="payment-main">
      <section class="cs-container payment-layout">
        <section class="summary-left">
          <div class="order-card">
            <h2 class="section-title">Order summary</h2>

            <div class="order-meta">
              <div class="meta-row">
                <span class="meta-label">Delivery type</span>
                <span class="meta-value">
                  {{ orderType === 'shop' ? 'Take in shop' : 'Room delivery' }}
                </span>
              </div>

              <div class="meta-row" v-if="orderType === 'room'">
                <span class="meta-label">Room number</span>
                <span class="meta-value">{{ roomNo }}</span>
              </div>
            </div>

            <hr class="divider" />

            <ul class="items-list">
              <!-- ✅ use cartId -->
              <li v-for="item in items" :key="item.cartId" class="item-row">
                <div class="item-info">
                  <div class="thumb">
                    <img :src="item.imageUrl" :alt="item.name" />
                  </div>
                  <div class="item-text">
                    <p class="item-name">{{ item.name }} ({{ item.sizeName }})</p>
                    <p class="item-desc">{{ item.description }}</p>
                  </div>
                </div>

                <div class="item-qty">x{{ item.quantity }}</div>
                <div class="item-price">{{ formatMoney(item.unitPrice * item.quantity) }}</div>
              </li>
            </ul>

            <hr class="divider" />

            <div class="totals">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>{{ formatMoney(subtotal) }}</span>
              </div>
              <div class="totals-row">
                <span>Ingredients</span>
                <span>{{ formatMoney(totalIngredientPrice) }}</span>
              </div>
              <div class="totals-row totals-row--strong">
                <span>Total</span>
                <span class="total-highlight">{{ formatMoney(total) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: SCAN PAY -->
        <section class="payment-right">
          <div class="pay-card">
            <h2 class="section-title">PromptPay QR</h2>

            <div class="scan-panel">
              <div class="scan-top">
                <div class="qr-frame">
                  <img
                    v-if="payment?.qrImageUrl"
                    :src="payment.qrImageUrl"
                    alt="PromptPay QR"
                    class="qr-img"
                  />
                  <div v-else class="qr-placeholder">
                    {{ loading ? 'Loading...' : 'QR' }}
                  </div>
                </div>

                <div class="scan-info">
                  <h3>Scan to pay</h3>

                  <p class="scan-text">
                    Use your banking app to scan this QR code. Amount:
                    <strong>{{ formatMoney(payment?.amount ?? total) }}</strong>
                  </p>

                  <div class="scan-meta">
                    <span>QR expires in:</span>
                    <strong>{{ expiresInText }}</strong>
                  </div>

                  <div class="scan-ref" v-if="payment?.referenceNo">
                    Ref: <strong>{{ payment.referenceNo }}</strong>
                  </div>

                  <label class="confirm-check">
                    <input type="checkbox" v-model="paidConfirmed" />
                    <span>I have completed the payment</span>
                  </label>

                  <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
                </div>
              </div>

              <hr class="divider" />

              <div class="scan-actions">
                <button type="button" class="btn-secondary" @click="changeMethod">
                  Change method
                </button>

                <button type="button" class="btn-outline" @click="refreshQr" :disabled="loading">
                  Refresh QR
                </button>
              </div>

              <button
                type="button"
                class="confirm-btn"
                :disabled="!paidConfirmed || loading"
                @click="confirmPaid"
              >
                Confirm paid
              </button>

              <p class="helper-note">
                Tip: If the QR expires, press “Refresh QR” to generate a new one.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import axios from 'axios'
import { useOrderSessionStore } from '@/stores/orderSession'

const router = useRouter()
const cartStore = useCartStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)

const total = computed(() => subtotal.value + totalIngredientPrice.value)
const session = useOrderSessionStore()
const customerName = computed(() => session.customerName || 'MIN PYAE HEIN')
const tableNumber = computed(() => session.placeNumber || '12')

const orderType = ref<'shop' | 'room'>('shop')
const roomNo = ref('1205')

const orderPlaceId = computed(() => Number(tableNumber.value) || 1)
const promptPayId = ref('0891234567')

type PaymentResponse = {
  id: number
  amount: number
  method: string
  status: string
  referenceNo: string
  gatewayPaymentId: string
  qrImageUrl: string | null
  createdAt: string
  paidAt: string | null
}

const payment = ref<PaymentResponse | null>(null)
const loading = ref(false)
const errorMsg = ref('')

const paidConfirmed = ref(false)

const expiresInSec = ref(300)
let timer: number | undefined

const expiresInText = computed(() => {
  const m = Math.floor(expiresInSec.value / 60)
  const s = expiresInSec.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function formatMoney(value: number): string {
  return `฿${Number(value).toFixed(0)}`
}

function buildPaymentRequestBody() {
  return {
    orderPlaceId: orderPlaceId.value,
    customerName: customerName.value,
    method: 'PROMPTPAY_QR',
    gateway: 'OMISE',
    promptPayId: promptPayId.value,
    amount: total.value,
    items: cartStore.items.map((i: any) => ({
      qty: i.quantity,
      menuItemSizeId: i.sizeId,
      note: i.note ?? '',
      status: 'PENDING',
      ingredients: (i.ingredients ?? []).map((ing: any) => ({
        ingredientId: ing.id,
        qty: ing.qty ?? 1,
      })),
    })),
  }
}

async function createPromptPayQr() {
  loading.value = true
  errorMsg.value = ''
  try {
    const body = buildPaymentRequestBody()
    const res = await axios.post<PaymentResponse>('/api/payments', body)
    console.log("res-->",res.data)
    payment.value = res.data
    paidConfirmed.value = false
    expiresInSec.value = 300
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || e?.message || 'Failed to create QR'
  } finally {
    loading.value = false
  }
}

async function refreshQr() {
  await createPromptPayQr()
}

function changeMethod() {
  router.push({ name: 'checkoutPaymentMethod' })
}

function goToCheckout() {
  router.push({ name: 'cart' })
}

function goToHome() {
  router.push({ name: 'home' })
}

async function confirmPaid() {
  router.push({ name: 'paymentSuccess' })
}

onMounted(async () => {
  await createPromptPayQr()

  timer = window.setInterval(() => {
    if (expiresInSec.value > 0) expiresInSec.value -= 1
  }, 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped src="@/styles/customer/payment-page.css"></style>
