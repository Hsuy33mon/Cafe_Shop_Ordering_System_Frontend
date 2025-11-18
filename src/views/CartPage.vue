<!-- src/views/CartPage.vue -->
<template>
  <div class="checkout-page">
    <!-- PAGE HEADER / COVER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Checkout</h1>

        <div class="breadcrumb-pill">
          <span class="crumb">Home</span>
          <span class="crumb-sep">/</span>
          <span class="crumb">Shop</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Checkout</span>
        </div>
      </div>
    </section>

    <!-- MAIN CART CONTENT -->
    <main class="cart-main">
      <section class="cs-container cart-layout">
        <!-- LEFT: ITEMS LIST -->
        <section class="cart-items">
          <header class="cart-head-row">
            <span class="col-item">Item</span>
            <span class="col-price">Price</span>
            <span class="col-qty">Quantity</span>
            <span class="col-total">Total</span>
            <span class="col-remove">Remove</span>
          </header>

          <div v-for="item in items" :key="item.id" class="cart-row">
            <!-- item info -->
            <div class="col-item item-info">
              <div class="thumb">
                <img :src="item.imageUrl" :alt="item.name" />
              </div>
              <div class="item-text">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-meta">{{ item.description }}</p>
              </div>
            </div>

            <!-- price -->
            <div class="col-price">
              {{ formatMoney(item.price) }}
            </div>

            <!-- quantity -->
            <div class="col-qty">
              <div class="qty-control">
                <button type="button" @click="decreaseQty(item)">-</button>
                <input type="text" :value="item.quantity" readonly />
                <button type="button" @click="increaseQty(item)">+</button>
              </div>
            </div>

            <!-- line total -->
            <div class="col-total">
              {{ formatMoney(item.price * item.quantity) }}
            </div>

            <!-- remove -->
            <div class="col-remove">
              <button type="button" class="remove-btn" @click="removeItem(item)">×</button>
            </div>
          </div>

          <p v-if="items.length === 0" class="empty-cart">
            Your cart is empty. Go back to the menu to add items.
          </p>
        </section>

        <!-- RIGHT: SUMMARY CARD -->
        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Order Type</h2>

            <!-- order type toggle -->
            <div class="payment-toggle">
              <button
                type="button"
                class="payment-tab"
                :class="{ 'payment-tab--active': orderType === 'shop' }"
                @click="setOrderType('shop')"
              >
                <span class="payment-icon">☕</span>
                <span>Take in shop</span>
              </button>

              <button
                type="button"
                class="payment-tab"
                :class="{ 'payment-tab--active': orderType === 'room' }"
                @click="setOrderType('room')"
              >
                <span class="payment-icon">🏨</span>
                <span>Room delivery</span>
              </button>
            </div>

            <!-- content for Take in shop -->
            <div v-if="orderType === 'shop'" class="payment-panel">
              <p class="order-text">
                We&apos;ll prepare your order and serve it at the cafe counter.
              </p>
            </div>

            <!-- content for Room delivery -->
            <div v-else class="payment-panel">
              <div class="field">
                <label class="field-label">Room number</label>
                <input v-model="roomNo" type="text" class="field-input" placeholder="Eg. 1205" />
              </div>
              <p class="order-text">
                Please make sure your room number is correct. We&apos;ll deliver your food directly
                to your room.
              </p>
            </div>

            <hr class="summary-divider" />

            <div class="totals">
              <div class="totals-row">
                <span>Cart Subtotal</span>
                <span>{{ formatMoney(subtotal) }}</span>
              </div>
              <div class="totals-row">
                <span>Shipping Cost</span>
                <span>{{ formatMoney(shippingCost) }}</span>
              </div>
              <div class="totals-row">
                <span>Discount</span>
                <span>{{ formatMoney(discount) }}</span>
              </div>
              <div class="totals-row totals-row--strong">
                <span>Cart Total</span>
                <span class="total-highlight">
                  {{ formatMoney(total) }}
                </span>
              </div>
            </div>

            <div class="summary-actions">
              <button type="button" class="summary-btn ghost">
                <span>Update</span>
                <span class="arrow">→</span>
              </button>
              <button type="button" class="summary-btn primary" @click="goToPayment">
                <span>Checkout</span>
                <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToPayment() {
  router.push('/payment')
}

type CartItem = {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  imageUrl: string
}

// Cafe shop mock data
const items = ref<CartItem[]>([
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
  {
    id: 4,
    name: 'Iced Caramel Latte',
    description: 'Espresso, caramel syrup, milk and ice cubes.',
    price: 95,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
  },
])

const couponCode = ref('')

const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

// demo numbers – adjust later with real logic
const shippingCost = computed(() => 40) // 40 THB
const discount = computed(() => 0)

const total = computed(() => subtotal.value + shippingCost.value - discount.value)

function increaseQty(item: CartItem) {
  item.quantity++
}

function decreaseQty(item: CartItem) {
  if (item.quantity > 1) item.quantity--
}

function removeItem(item: CartItem) {
  items.value = items.value.filter((i) => i.id !== item.id)
}

// Thai baht currency
function formatMoney(value: number): string {
  return `฿${value.toFixed(0)}`
}

type PaymentMethod = 'card' | 'promptpay'

const selectedPayment = ref<PaymentMethod>('card')
function setPayment(method: PaymentMethod) {
  selectedPayment.value = method
}
type OrderType = 'shop' | 'room'

const orderType = ref<OrderType>('shop')
const roomNo = ref('')

function setOrderType(type: OrderType) {
  orderType.value = type
  if (type === 'shop') {
    roomNo.value = '' // clear when user goes back to take in shop
  }
}
</script>

<style scoped>
.checkout-page {
  background-color: var(--cs-bg);
}

/* ---------- PAGE HEADER COVER ---------- */
.checkout-hero {
  background-color: #f9fafb;
  border-bottom: 1px solid rgba(15, 23, 42, 0.03);
}

.checkout-hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 2.5rem;
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

/* ---------- MAIN CART CONTENT ---------- */
.cart-main {
  padding-block: 2rem 3rem;
}

/* layout */
.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.2fr);
  gap: 2rem;
}

/* -------- LEFT: TABLE -------- */
.cart-items {
  background-color: #ffffff;
  border-radius: 24px; /* same feeling as Order Type card */
  box-shadow: var(--cs-shadow-soft); /* same shadow as summary-card      */
  padding: 1.3rem 1.5rem 1.4rem; /* space between border & content   */
}

.cart-head-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--cs-border-soft);
  font-size: 0.85rem;
  font-weight: 600;
}

.cart-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  font-size: 0.9rem;
}

.col-item,
.col-price,
.col-qty,
.col-total,
.col-remove {
  padding-inline: 0.25rem;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
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
  font-weight: 600;
}

.item-meta {
  font-size: 0.8rem;
  color: var(--cs-text-muted);
}

/* quantity control */
.qty-control {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.qty-control input {
  width: 40px;
  border: none;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.3rem 0.2rem;
  outline: none;
}

.qty-control button {
  width: 24px;
  border: none;
  background-color: #f9fafb;
  font-size: 0.9rem;
  cursor: pointer;
}

.qty-control button:hover {
  background-color: #e5e7eb;
}

.remove-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.empty-cart {
  padding: 1.5rem 0;
  font-size: 0.9rem;
  color: var(--cs-text-muted);
}

/* -------- RIGHT: SUMMARY CARD -------- */
.cart-summary {
  display: flex;
  justify-content: flex-end;
}

.summary-card {
  width: 100%;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: var(--cs-shadow-soft);
  padding: 1.6rem 1.5rem 1.6rem;
}

.summary-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.summary-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 0.85rem;
  padding: 0.55rem 0.7rem;
  outline: none;
  background-color: #f9fafb;
}

.summary-input.full {
  grid-column: 1 / -1;
}

.summary-input:focus {
  border-color: var(--cs-primary);
}

.summary-btn {
  margin-top: 0.6rem;
  border-radius: 999px;
  border: none;
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.summary-btn.primary {
  background-color: var(--cs-primary);
  color: #111827;
}

.summary-btn.ghost {
  background-color: #f9fafb;
  color: #111827;
}

.summary-btn.full {
  width: 100%;
}

.summary-divider {
  margin: 1.1rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.summary-text {
  font-size: 0.8rem;
  color: var(--cs-text-muted);
  margin-bottom: 0.75rem;
}

.totals {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.totals-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.totals-row--strong {
  margin-top: 0.2rem;
  font-weight: 600;
}

.total-highlight {
  color: #f97316;
}

.summary-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

.arrow {
  font-size: 0.9rem;
}

/* -------- RESPONSIVE -------- */
@media (max-width: 960px) {
  .checkout-hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .cart-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .cart-summary {
    justify-content: stretch;
  }

  .summary-card {
    max-width: 100%;
  }

  .cart-head-row,
  .cart-row {
    grid-template-columns: 3fr 1fr 1.5fr 1fr 0.7fr;
  }
}

@media (max-width: 640px) {
  .cart-head-row {
    display: none;
  }

  .cart-row {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'item item'
      'price qty'
      'total remove';
    row-gap: 0.5rem;
  }

  .col-item {
    grid-area: item;
  }

  .col-price {
    grid-area: price;
  }

  .col-qty {
    grid-area: qty;
  }

  .col-total {
    grid-area: total;
  }

  .col-remove {
    grid-area: remove;
    text-align: right;
  }

  .item-info {
    align-items: flex-start;
  }
}
/* ---------- PAYMENT SECTION ---------- */
.payment-toggle {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}

.payment-tab {
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

.payment-tab--active {
  background-color: var(--cs-primary);
  border-color: var(--cs-primary);
}

.payment-icon {
  font-size: 1rem;
}

.payment-panel {
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

/* PromptPay */
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
</style>
