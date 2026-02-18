<!-- src/views/CartPage.vue -->
<template>
  <div class="checkout-page">
    <!-- PAGE HEADER / COVER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Checkout</h1>

        <div class="breadcrumb-pill">
          <span class="crumb crumb--link" @click="goToHome"> Home </span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--link" @click="goToMenu"> Menu </span>
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
          <template v-if="items.length > 0">
            <div v-for="item in items" :key="item.cartId" class="cart-card">
              <div class="cart-card-left" @click="goToProductDetails(item)">
                <img :src="item.imageUrl" :alt="item.name" class="cart-thumb" />

                <!-- <img
  :src="item.imageUrl"
  :alt="item.name"
  class="cart-thumb"
  @click="goToProductDetails(item)"
/> -->

                <div class="cart-info">
                  <p class="cart-name">{{ item.name }}</p>
                  <p class="cart-desc">{{ item.description }}</p>

                  <p class="cart-size">Size: {{ item.sizeName }}</p>

                  <div v-if="item.ingredients.length" class="cart-ingredients">
                    <span v-for="ing in item.ingredients" :key="ing.id" class="ingredient-tag">
                      {{ ing.name }} ({{ ing.amount }})
                    </span>
                  </div>
                </div>
              </div>

              <div class="cart-card-right">
                <div class="cart-total">
                  {{ formatMoney(item.unitPrice * item.quantity) }}
                </div>

                <div class="qty-control">
                  <button @click="decreaseQty(item)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="increaseQty(item)">+</button>
                </div>

                <button class="remove-btn" @click="removeItem(item)">×</button>
              </div>
            </div>
          </template>

          <div v-else class="empty-cart">Your cart is empty.</div>
        </section>

        <!-- RIGHT: SUMMARY CARD -->
        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Payment Summary</h2>
            <hr class="summary-divider" />
            <div class="totals">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>{{ formatMoney(subtotal) }}</span>
              </div>

              <div class="totals-row">
                <span>Ingredients</span>
                <span>{{ formatMoney(totalIngredientPrice) }}</span>
              </div>

              <div class="totals-divider"></div>

              <div class="totals-row totals-row--strong">
                <span>Total</span>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'

const router = useRouter()
const cartStore = useCartStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const total = computed(() => cartStore.totalPrice)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)

function goToPayment() {
  router.push('/payment')
}

function goToProductDetails(item: any) {
  router.push({
    name: 'product-details',
    params: { id: item.productId },
    query: {
      sizeId: item.sizeId,
      qty: item.quantity,
      ingredients: item.ingredients.map((i: any) => i.id).join(','),
    },
  })
}

function removeItem(item: any) {
  cartStore.removeItem(item.cartId)
}

function increaseQty(item: any) {
  cartStore.increaseQty(item.cartId)
}

function decreaseQty(item: any) {
  cartStore.decreaseQty(item.cartId)
}

function formatMoney(value: number): string {
  return `฿${value.toFixed(0)}`
}

function goToMenu() {
  router.push({ name: 'shop' })
}
function goToHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped src="@/styles/customer/cart-page.css"></style>
