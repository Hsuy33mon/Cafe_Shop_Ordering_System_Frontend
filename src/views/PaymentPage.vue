<template>
  <div class="payment-page">
    <!-- PAGE HEADER / COVER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Payment</h1>

        <div class="breadcrumb-pill">
          <span class="crumb">Home</span>
          <span class="crumb-sep">/</span>
          <span class="crumb">Checkout</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Payment</span>
        </div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <main class="payment-main">
      <section class="cs-container payment-layout">
        <!-- LEFT: ORDER SUMMARY -->
        <section class="summary-left">
          <div class="order-card">
            <h2 class="section-title">Order summary</h2>

            <!-- delivery type -->
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

            <!-- items list -->
            <ul class="items-list">
              <li v-for="item in items" :key="item.id" class="item-row">
                <div class="item-info">
                  <div class="thumb">
                    <img :src="item.imageUrl" :alt="item.name" />
                  </div>
                  <div class="item-text">
                    <p class="item-name">{{ item.name }}</p>
                    <p class="item-desc">{{ item.description }}</p>
                  </div>
                </div>

                <div class="item-qty">x{{ item.quantity }}</div>
                <div class="item-price">
                  {{ formatMoney(item.price * item.quantity) }}
                </div>
              </li>
            </ul>

            <hr class="divider" />

            <!-- totals -->
            <div class="totals">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>{{ formatMoney(subtotal) }}</span>
              </div>
              <div class="totals-row">
                <span>Shipping</span>
                <span>{{ formatMoney(shippingCost) }}</span>
              </div>
              <div class="totals-row">
                <span>Discount</span>
                <span>{{ formatMoney(discount) }}</span>
              </div>
              <div class="totals-row totals-row--strong">
                <span>Total</span>
                <span class="total-highlight">
                  {{ formatMoney(total) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: PAYMENT OPTIONS -->
        <section class="payment-right">
          <div class="pay-card">
            <h2 class="section-title">Payment method</h2>

            <!-- method toggle -->
            <div class="method-toggle">
              <button
                type="button"
                class="method-tab"
                :class="{ 'method-tab--active': selectedMethod === 'card' }"
                @click="selectedMethod = 'card'"
              >
                <span class="method-icon">💳</span>
                <span>Visa / MasterCard</span>
              </button>

              <button
                type="button"
                class="method-tab"
                :class="{ 'method-tab--active': selectedMethod === 'promptpay' }"
                @click="selectedMethod = 'promptpay'"
              >
                <span class="method-icon">📱</span>
                <span>PromptPay</span>
              </button>
            </div>

            <!-- card payment -->
            <div v-if="selectedMethod === 'card'" class="method-panel">
              <div class="field">
                <label class="field-label">Card holder name</label>
                <input
                  v-model="cardName"
                  type="text"
                  class="field-input"
                  placeholder="Name on card"
                />
              </div>

              <div class="field">
                <label class="field-label">Card number</label>
                <input
                  v-model="cardNumber"
                  type="text"
                  class="field-input"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>

              <div class="field-row">
                <div class="field">
                  <label class="field-label">Expiry date</label>
                  <input
                    v-model="cardExpiry"
                    type="text"
                    class="field-input"
                    placeholder="MM / YY"
                  />
                </div>
                <div class="field">
                  <label class="field-label">CVV</label>
                  <input v-model="cardCvv" type="password" class="field-input" placeholder="***" />
                </div>
              </div>
            </div>

            <!-- PromptPay -->
            <div v-else class="method-panel promptpay-panel">
              <div class="qr-box">
                <div class="qr-inner">
                  <span>QR</span>
                </div>
              </div>
              <p class="promptpay-text">
                Use your banking app to scan this PromptPay QR code. Your order total is
                <strong>{{ formatMoney(total) }}</strong
                >.
              </p>
            </div>

            <hr class="divider" />

            <p class="pay-note">
              By clicking “Pay now”, your cafe order will be confirmed and processed according to
              the selected delivery type.
            </p>

            <button type="button" class="pay-btn" @click="submitPayment">
              Pay now – {{ formatMoney(total) }}
            </button>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type OrderType = 'shop' | 'room'
type PaymentMethod = 'card' | 'promptpay'

type OrderItem = {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  imageUrl: string
}

// Mock order data – later you can replace with props / store
const orderType = ref<OrderType>('room')
const roomNo = ref('1205')

const items = ref<OrderItem[]>([
  {
    id: 1,
    name: 'Chevrefrit Bowl',
    description: 'Salad bowl with tomatoes, feta cheese and fresh greens.',
    price: 189,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
  },
  {
    id: 2,
    name: 'Saumon Gravlax',
    description: 'Salmon, avocado, cucumber, sushi rice & house sauce.',
    price: 159,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg',
  },
  {
    id: 3,
    name: 'Gourmet Burger',
    description: 'Beef patty, cheddar, lettuce, tomato on brioche bun.',
    price: 139,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
  },
])

const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

const shippingCost = computed(() => 40) // example
const discount = computed(() => 0)
const total = computed(() => subtotal.value + shippingCost.value - discount.value)

// payment state
const selectedMethod = ref<PaymentMethod>('card')
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

function formatMoney(value: number): string {
  return `฿${value.toFixed(0)}`
}

function submitPayment() {
  if (selectedMethod.value === 'card') {
    // later: real validation + API call
    console.log('Paying by card', {
      cardName: cardName.value,
      cardNumber: cardNumber.value,
      cardExpiry: cardExpiry.value,
      last4: cardNumber.value.slice(-4),
      amount: total.value,
      orderType: orderType.value,
      roomNo: roomNo.value,
    })
  } else {
    console.log('Paying by PromptPay QR', {
      amount: total.value,
      orderType: orderType.value,
      roomNo: roomNo.value,
    })
  }
  alert('Mock payment submitted – connect this to your backend later.')
}
</script>

<style scoped>
.payment-page {
  background-color: var(--cs-bg);
}

/* ---------- HEADER / COVER ---------- */
.checkout-hero {
  background-color: #f9fafb;
  border-bottom: 1px solid rgba(15, 23, 42, 0.03);
}

.checkout-hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 2.3rem;
}

.checkout-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.breadcrumb-pill {
  background-color: var(--cs-primary);
  padding: 0.7rem 1.4rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
}

.crumb {
  color: #1f2933;
  font-weight: 500;
}

.crumb--active {
  font-weight: 700;
}

.crumb-sep {
  color: rgba(15, 23, 42, 0.6);
}

/* ---------- MAIN LAYOUT ---------- */
.payment-main {
  padding-block: 2rem 3rem;
}

.payment-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.4fr);
  gap: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

/* ORDER SUMMARY LEFT */
.order-card {
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: var(--cs-shadow-soft);
  padding: 1.6rem 1.5rem 1.6rem;
}

.order-meta {
  margin-bottom: 0.8rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.meta-label {
  color: var(--cs-text-muted);
}

.meta-value {
  font-weight: 500;
}

.divider {
  margin: 0.9rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* items list */
.items-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.item-row {
  display: grid;
  grid-template-columns: minmax(0, 4fr) auto auto;
  align-items: center;
  column-gap: 0.75rem;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumb {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  overflow: hidden;
  background-color: #e5e7eb;
  flex-shrink: 0;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.item-desc {
  font-size: 0.78rem;
  color: var(--cs-text-muted);
}

.item-qty {
  font-size: 0.85rem;
  text-align: center;
}

.item-price {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
}

/* totals */
.totals {
  font-size: 0.88rem;
  margin-top: 0.25rem;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.totals-row--strong {
  margin-top: 0.2rem;
  font-weight: 600;
}

.total-highlight {
  color: #f97316;
}

/* PAYMENT RIGHT */
.pay-card {
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: var(--cs-shadow-soft);
  padding: 1.6rem 1.5rem 1.8rem;
}

.method-toggle {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}

.method-tab {
  flex: 1;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
}

.method-tab--active {
  background-color: var(--cs-primary);
  border-color: var(--cs-primary);
}

.method-icon {
  font-size: 1rem;
}

.method-panel {
  margin-top: 0.4rem;
  margin-bottom: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.field-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.field-input {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.65rem;
  font-size: 0.85rem;
  background-color: #f9fafb;
  outline: none;
}

.field-input:focus {
  border-color: var(--cs-primary);
}

/* promptpay qr */
.promptpay-panel {
  align-items: center;
  text-align: center;
}

.qr-box {
  padding: 0.4rem;
  border-radius: 16px;
  background: radial-gradient(circle at top, #fef3c7, #fefce8);
}

.qr-inner {
  width: 140px;
  height: 140px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.promptpay-text {
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: var(--cs-text-muted);
}

/* pay note & button */
.pay-note {
  font-size: 0.78rem;
  color: var(--cs-text-muted);
  margin-bottom: 0.8rem;
}

.pay-btn {
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 0.65rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: var(--cs-primary);
  color: #111827;
  cursor: pointer;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 960px) {
  .checkout-hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .payment-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .payment-right {
    margin-top: 1rem;
  }
}
</style>
