<template>
  <div class="cash-page">
    <!-- HERO -->
    <section class="hero">
      <div class="cs-container hero-inner">
        <div>
          <h1 class="hero-title">Cash Payment</h1>
          <p class="hero-sub">
            Pay by cash at counter / delivery. Your payment status will be
            <b>PENDING</b> and staff will confirm later.
          </p>
        </div>

        <div class="crumb-pill">
          <span class="crumb" @click="goHome">Home</span>
          <span class="sep">/</span>
          <span class="crumb" @click="goCart">Checkout</span>
          <span class="sep">/</span>
          <span class="crumb active">Cash</span>
        </div>
      </div>
    </section>

    <main class="cs-container main">
      <div class="grid">
        <!-- LEFT: SUMMARY -->
        <section class="card">
          <h2 class="card-title">Order summary</h2>

          <div class="meta">
            <div class="meta-row">
              <span class="k">Customer</span>
              <span class="v">{{ customerName }}</span>
            </div>
            <div class="meta-row">
              <span class="k">{{ placeLabel }}</span>
              <span class="v">{{ placeText }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <ul class="items">
            <li v-for="it in items" :key="it.cartId" class="item">
              <div class="left">
                <img class="thumb" :src="it.imageUrl" :alt="it.name" />
                <div class="txt">
                  <p class="name">{{ it.name }} ({{ it.sizeName }})</p>
                  <p class="desc">{{ it.description }}</p>
                </div>
              </div>

              <div class="right">
                <span class="qty">x{{ it.quantity }}</span>
                <span class="price">{{ money(it.unitPrice * it.quantity) }}</span>
              </div>
            </li>
          </ul>

          <div class="divider"></div>

          <div class="totals">
            <div class="row">
              <span>Subtotal</span>
              <span>{{ money(subtotal) }}</span>
            </div>
            <div class="row">
              <span>Ingredients</span>
              <span>{{ money(totalIngredientPrice) }}</span>
            </div>
            <div class="row strong">
              <span>Total</span>
              <span class="total">{{ money(total) }}</span>
            </div>
          </div>
        </section>

        <!-- RIGHT: CONFIRM -->
        <section class="card card-accent">
          <div class="badge">💵 CASH</div>
          <h2 class="card-title">Confirm cash order</h2>

          <ul class="tips">
            <li>Please prepare the exact amount.</li>
            <li>Staff will collect payment upon delivery / counter.</li>
            <li>Order will be placed as <b>PENDING_CASH</b> (or PENDING).</li>
          </ul>

          <div class="divider"></div>

          <div class="action-row">
            <button class="btn ghost" :disabled="loading" @click="changeMethod">
              Change method
            </button>

            <button class="btn primary" :disabled="loading || items.length === 0" @click="confirm">
              <span v-if="!loading">Confirm order — {{ money(total) }}</span>
              <span v-else>Placing order...</span>
            </button>
          </div>

          <p v-if="errorText" class="error">{{ errorText }}</p>
          <p class="hint">
            After confirming, you will see the success page immediately.
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'
import { useOrderSessionStore } from '@/stores/orderSession'
import { usePaymentStore } from '@/stores/usePaymentStore'

const router = useRouter()
const cartStore = useCartStore()
const session = useOrderSessionStore()
const paymentStore = usePaymentStore()

const errorText = ref('')

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)
const total = computed(() => subtotal.value + totalIngredientPrice.value)

const customerName = computed(() => session.customerName || 'Customer')
const placeLabel = computed(() => (session.orderType === 'ROOM' ? 'Room' : 'Table'))
const placeText = computed(() => {
  const no = session.placeNumber || session.tableNumber || '-'
  return session.orderType === 'ROOM' ? String(no) : `T-${no}`
})

const orderPlaceId = computed(() => Number(session.orderPlaceId || session.placeNumber || 1) || 1)

const loading = computed(() => paymentStore.loading)

function money(v: number) {
  return `฿${Number(v).toFixed(0)}`
}

function goHome() {
  router.push({ name: 'home' })
}
function goCart() {
  router.push({ name: 'cart' })
}

function changeMethod() {
  router.push({ name: 'payment' })
}

async function confirm() {
  errorText.value = ''

  if (!items.value.length) {
    errorText.value = 'Your cart is empty.'
    return
  }
  if (!customerName.value.trim()) {
    errorText.value = 'Customer name is missing.'
    return
  }

  try {
    // ✅ THIS CALLS BACKEND: POST api/payments
    const pay = await paymentStore.createPayment({
      orderPlaceId: orderPlaceId.value,
      customerName: customerName.value,
      method: 'CASH',
      gateway: 'CASH',
    })

    // optional: clear cart
    cartStore.clearCart?.()

    // ✅ go success page directly (pending cash)
    router.replace({
      name: 'paymentSuccess',
      query: {
        paymentId: String(pay.id),
        invoiceId: String(pay.invoiceId),
        method: 'CASH',
        status: pay.status,
      },
    })
  } catch (e: any) {
    // show store error
    errorText.value = paymentStore.error || e?.message || 'Cash confirm failed'
  }
}
</script>

<style scoped src="@/styles/customer/cash-pay-page.css"></style>