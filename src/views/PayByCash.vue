<template>
  <div class="payment-page">
    <!-- HEADER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Cash Payment</h1>

        <div class="breadcrumb-pill">
          <span class="crumb crumb--link" @click="goHome">Home</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--link" @click="goMethod">Checkout</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Cash</span>
        </div>
      </div>
    </section>

    <main class="payment-main">
      <section class="cs-container payment-layout">
        <!-- LEFT: Order summary -->
        <section class="summary-left">
          <div class="order-card">
            <h2 class="section-title">Order summary</h2>

            <div class="totals">
              <div class="totals-row totals-row--strong">
                <span>Total</span>
                <span class="total-highlight">{{ formatMoney(total) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: Cash confirmation -->
        <section class="payment-right">
          <div class="pay-card">
            <h2 class="section-title">Confirm cash payment</h2>

            <div class="cash-panel">
              <div class="cash-badge">💵 Cash</div>

              <p class="cash-text">
                You selected <strong>Cash</strong>. Please prepare the exact amount.
              </p>

              <ul class="cash-list">
                <li>Staff will collect payment upon delivery.</li>
                <li>Your order will be placed as <strong>PENDING_CASH</strong>.</li>
              </ul>

              <div class="cash-total">
                <span>Total</span>
                <strong>{{ formatMoney(total) }}</strong>
              </div>
            </div>

            <hr class="divider" />

            <div class="actions">
              <button type="button" class="btn-secondary" @click="goMethod">Change method</button>

              <button type="button" class="pay-btn" @click="confirmCash">
                Confirm order – {{ formatMoney(total) }}
              </button>
            </div>

            <p class="helper-note">If you want to pay by QR or Card, click “Change method”.</p>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'

const router = useRouter()
const cartStore = useCartStore()

const total = computed(() => cartStore.cartSubtotal)

function formatMoney(value: number) {
  return `฿${value.toFixed(0)}`
}

function goMethod() {
  router.push({ name: 'checkoutPaymentMethod' })
}

function goHome() {
  router.push({ name: 'home' })
}

function confirmCash() {
  // TODO: call backend to set payment method CASH and create order
  router.push({ name: 'paymentSuccess' })
}
</script>

<style scoped src="@/styles/customer/payment-page.css"></style>
