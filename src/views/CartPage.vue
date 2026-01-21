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
            <h2 class="summary-title">Payment Summary</h2>
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
<style scoped src="@/styles/customer/cart-page.css"></style>
