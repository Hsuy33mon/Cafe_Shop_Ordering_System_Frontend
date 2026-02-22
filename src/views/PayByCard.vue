<template>
  <div class="payment-page">
    <!-- HEADER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Card Payment</h1>

        <div class="breadcrumb-pill">
          <span class="crumb crumb--link" @click="goHome">Home</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--link" @click="goMethod">Checkout</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Card</span>
        </div>
      </div>
    </section>

    <main class="payment-main">
      <section class="cs-container payment-layout">
        <!-- LEFT: SUMMARY -->
        <section class="summary-left">
          <div class="order-card">
            <h2 class="section-title">Order summary</h2>

            <div class="totals">
              <div class="totals-row totals-row--strong">
                <span>Total</span>
                <span class="total-highlight">
                  {{ formatMoney(total) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: CARD FORM -->
        <section class="payment-right">
          <div class="pay-card">
            <h2 class="section-title">Enter card details</h2>

            <div class="method-panel">
              <div class="field">
                <label class="field-label">Card holder name</label>
                <input v-model="cardName" class="field-input" placeholder="Name on card" />
              </div>

              <div class="field">
                <label class="field-label">Card number</label>
                <input v-model="cardNumber" class="field-input" placeholder="XXXX XXXX XXXX XXXX" />
              </div>

              <div class="field-row">
                <div class="field">
                  <label class="field-label">Expiry</label>
                  <input v-model="cardExpiry" class="field-input" placeholder="MM/YY" />
                </div>

                <div class="field">
                  <label class="field-label">CVV</label>
                  <input v-model="cardCvv" type="password" class="field-input" placeholder="***" />
                </div>
              </div>
            </div>

            <hr class="divider" />

            <div class="actions">
              <button type="button" class="btn-secondary" @click="goMethod">Change method</button>

              <button type="button" class="pay-btn" :disabled="!isValid" @click="submitCardPayment">
                Pay now – {{ formatMoney(total) }}
              </button>
            </div>

            <p class="helper-note">
              Secure payment. You may be redirected for verification (3D Secure).
            </p>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'

const router = useRouter()
const cartStore = useCartStore()

const total = computed(() => cartStore.cartSubtotal)

const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const isValid = computed(
  () =>
    cardName.value &&
    cardNumber.value.length >= 12 &&
    cardExpiry.value &&
    cardCvv.value.length >= 3,
)

function formatMoney(value: number) {
  return `฿${value.toFixed(0)}`
}

function goMethod() {
  router.push({ name: 'checkoutPaymentMethod' })
}

function goHome() {
  router.push({ name: 'home' })
}

function submitCardPayment() {
  console.log('Card payment submit')

  // TODO: call backend payment API
  router.push({ name: 'paymentSuccess' })
}
</script>
<style scoped src="@/styles/customer/payment-page.css"></style>
