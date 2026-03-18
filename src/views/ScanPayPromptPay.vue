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
                <span>{{ formatMoney(subtotal - totalIngredientPrice) }}</span>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useOrderSessionStore } from '../stores/orderSession'
import { usePaymentStore } from '../stores/usePaymentStore'
import { useWsStore } from '@/stores/useWsStore'

const router = useRouter()
const cartStore = useCartStore()
const session = useOrderSessionStore()
const paymentStore = usePaymentStore()
const wsStore = useWsStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)
const total = computed(() => subtotal.value + totalIngredientPrice.value)

const customerName = computed(() => session.customerName || 'MIN PYAE HEIN')
const tableNumber = computed(() => session.placeNumber || '12')
const orderPlaceId = computed(() => Number(tableNumber.value) || 1)
const promptPayId = computed(() => '0891234567')

const payment = computed(() => paymentStore.payment)
const loading = computed(() => paymentStore.loading)
const errorMsg = computed(() => paymentStore.error)
const expiresInText = computed(() => paymentStore.expiresInText)

const paidConfirmed = ref(false)
const redirected = ref(false)

function formatMoney(value: number): string {
  return `฿${Number(value).toFixed(0)}`
}

async function refreshQr() {
  await paymentStore.refreshQr({
    orderPlaceId: orderPlaceId.value,
    customerName: customerName.value,
    promptPayId: promptPayId.value,
  })
}

function changeMethod() {
  paymentStore.cancelPayment()
  router.push({ name: 'checkoutPaymentMethod' })
}

function goToCheckout() {
  router.push({ name: 'cart' })
}

function goToHome() {
  router.push({ name: 'home' })
}

function isPaidStatus(status?: string) {
  return ['PAID', 'SUCCESS', 'COMPLETED'].includes(String(status || '').toUpperCase())
}

function goToPaymentSuccess() {
  if (!payment.value?.id || redirected.value) return

  redirected.value = true

  cartStore.clearCart?.()

  router
    .replace({
      name: 'paymentSuccess',
      query: {
        paymentId: String(payment.value.id),
        invoiceId: payment.value.invoiceId ? String(payment.value.invoiceId) : '',
        method: payment.value.paymentType || 'PROMPTPAY',
        status: payment.value.status || 'PAID',
      },
    })
    .catch(() => {})
}

// fallback button
async function confirmPaid() {
  if (isPaidStatus(payment.value?.status)) {
    goToPaymentSuccess()
    return
  }

  // optional fallback if user manually confirms before WS arrives
  router
    .replace({
      name: 'paymentSuccess',
      query: {
        paymentId: String(payment.value?.id || ''),
        invoiceId: payment.value?.invoiceId ? String(payment.value.invoiceId) : '',
        method: payment.value?.paymentType || 'PROMPTPAY',
        status: payment.value?.status || 'PENDING',
      },
    })
    .catch(() => {})
}

let timer: number | undefined
let currentSubscribedPaymentId: number | null = null

watch(
  () => payment.value?.id,
  (paymentId) => {
    if (!paymentId) return

    const numericPaymentId = Number(paymentId)

    if (currentSubscribedPaymentId === numericPaymentId) return

    if (currentSubscribedPaymentId) {
      wsStore.unsubscribePayment(currentSubscribedPaymentId)
    }

    currentSubscribedPaymentId = numericPaymentId

    wsStore.subscribePayment(numericPaymentId, (evt) => {
      console.log('PAYMENT EVT', evt)
      console.log('payment status -->', evt.paymentStatus)

      // keep latest event in store already handled by wsStore
      if (isPaidStatus(evt.paymentStatus)) {
        goToPaymentSuccess()
      }
    })
  },
  { immediate: true },
)

watch(
  () => payment.value?.status,
  (status) => {
    if (isPaidStatus(status)) {
      goToPaymentSuccess()
    }
  },
)

onMounted(async () => {
  await paymentStore.ensurePromptPayPayment({
    orderPlaceId: orderPlaceId.value,
    customerName: customerName.value,
    promptPayId: promptPayId.value,
  })

  wsStore.connect()

  timer = window.setInterval(() => {
    paymentStore.tick()
  }, 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)

  if (currentSubscribedPaymentId) {
    wsStore.unsubscribePayment(currentSubscribedPaymentId)
  }

  // only cancel if still unpaid
  if (!isPaidStatus(payment.value?.status)) {
    paymentStore.cancelPayment()
  }

  // optional: don't disconnect global ws if other pages use it
  // wsStore.disconnect()
})
</script>
<style scoped src="@/styles/customer/payment-page.css"></style>
