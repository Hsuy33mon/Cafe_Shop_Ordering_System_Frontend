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

// ✅ For your backend, orderPlaceId looks like "place id" (not table no).
// Use session.orderPlaceId if you have.
// fallback: parse from table/room number
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
  // change to your real route name for method select page
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

<style scoped>
.cash-page {
  min-height: 100vh;
  background: #f7f9ff;
}

/* hero */
.hero {
  background: linear-gradient(180deg, #fff 0%, #f7f9ff 100%);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  padding: 24px 0 18px;
}
.hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
}
.hero-title {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #0f172a;
}
.hero-sub {
  margin: 8px 0 0;
  max-width: 560px;
  color: #475569;
  line-height: 1.45;
}
.crumb-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffb000;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 900;
  color: #1a1200;
}
.crumb {
  cursor: pointer;
  text-decoration: underline;
}
.crumb.active {
  text-decoration: none;
}
.sep {
  opacity: 0.85;
}

.main {
  padding: 22px 0 42px;
}

/* grid */
.grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 22px;
}
@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* card */
.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  padding: 18px;
}
.card-accent {
  border: 1px solid rgba(255, 176, 0, 0.28);
}
.card-title {
  margin: 0 0 12px;
  font-size: 1.25rem;
  font-weight: 900;
  color: #0f172a;
}
.badge {
  display: inline-flex;
  background: rgba(255, 176, 0, 0.18);
  color: #7a4b00;
  font-weight: 900;
  padding: 8px 10px;
  border-radius: 14px;
  margin-bottom: 10px;
}

.divider {
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  margin: 14px 0;
}

/* meta */
.meta {
  display: grid;
  gap: 10px;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.k {
  color: #64748b;
  font-weight: 800;
}
.v {
  color: #0f172a;
  font-weight: 900;
}

/* items */
.items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.left {
  display: flex;
  gap: 12px;
  min-width: 0;
}
.thumb {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
  background: #eef2ff;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.txt {
  min-width: 0;
}
.name {
  margin: 0;
  font-weight: 900;
  color: #0f172a;
  font-size: 0.98rem;
}
.desc {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 420px;
}
.right {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.qty {
  color: #64748b;
  font-weight: 800;
}
.price {
  color: #0f172a;
  font-weight: 900;
}

/* totals */
.totals {
  display: grid;
  gap: 10px;
}
.totals .row {
  display: flex;
  justify-content: space-between;
  color: #334155;
  font-weight: 800;
}
.totals .row.strong {
  padding-top: 10px;
  border-top: 1px dashed rgba(15, 23, 42, 0.16);
}
.total {
  color: #ff7a18;
  font-size: 1.2rem;
  font-weight: 1000;
}

/* right card */
.tips {
  margin: 0;
  padding-left: 18px;
  color: #334155;
  line-height: 1.55;
  font-weight: 700;
}
.action-row {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 12px;
  margin-top: 14px;
}

.btn {
  border: 0;
  border-radius: 16px;
  padding: 12px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn:active {
  transform: translateY(1px);
}
.btn.primary {
  background: linear-gradient(135deg, #ffb23f, #ff7a18);
  color: #1a1200;
  box-shadow: 0 12px 28px rgba(255, 122, 24, 0.25);
}
.btn.ghost {
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}
.btn.ghost:hover {
  background: rgba(15, 23, 42, 0.09);
}

.error {
  margin-top: 10px;
  color: #b91c1c;
  font-weight: 800;
}
.hint {
  margin-top: 10px;
  color: #64748b;
  font-size: 0.9rem;
}
</style>