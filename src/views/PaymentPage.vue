<template>
  <div class="payment-page">
    <!-- PAGE HEADER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Payment</h1>

        <div class="breadcrumb-pill">
          <span class="crumb crumb--link" @click="goToHome">Home</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--link" @click="goToCheckout">Checkout</span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Payment</span>
        </div>
      </div>
    </section>

    <!-- MAIN -->
    <main class="payment-main">
      <section class="cs-container payment-layout">

        <!-- LEFT -->
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
              <li v-for="item in items" :key="item.id" class="item-row">
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
                <div class="item-price">
                  {{ formatMoney(item.unitPrice * item.quantity) }}
                </div>
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
                <span class="total-highlight">
                  {{ formatMoney(total) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT -->
        <section class="payment-right">
          <div class="pay-card">
            <h2 class="section-title">Payment method</h2>

            <div class="method-toggle">
              <button
                type="button"
                class="method-tab"
                :class="{ 'method-tab--active': selectedMethod === 'card' }"
                @click="selectedMethod = 'card'"
              >
                💳 Visa / MasterCard
              </button>

              <button
                type="button"
                class="method-tab"
                :class="{ 'method-tab--active': selectedMethod === 'promptpay' }"
                @click="selectedMethod = 'promptpay'"
              >
                📱 PromptPay
              </button>
            </div>

            <div v-if="selectedMethod === 'card'" class="method-panel">
              <input v-model="cardName" class="field-input" placeholder="Name on card" />
              <input v-model="cardNumber" class="field-input" placeholder="XXXX XXXX XXXX XXXX" />
              <input v-model="cardExpiry" class="field-input" placeholder="MM / YY" />
              <input v-model="cardCvv" type="password" class="field-input" placeholder="CVV" />
            </div>

            <div v-else class="method-panel promptpay-panel">
              <p>Scan PromptPay QR to pay {{ formatMoney(total) }}</p>
            </div>

            <hr class="divider" />

            <button
              type="button"
              class="pay-btn"
              :disabled="loading"
              @click="submitPayment"
            >
              {{ loading ? 'Processing...' : `Pay now – ${formatMoney(total)}` }}
            </button>

          </div>
        </section>

      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/useCartStore'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const cartStore = useCartStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)
const total = computed(() => subtotal.value)

type OrderType = 'shop' | 'room'
type PaymentMethod = 'card' | 'promptpay'

const orderType = ref<OrderType>('room')
const roomNo = ref('1205')

const selectedMethod = ref<PaymentMethod>('card')
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const loading = ref(false)

function formatMoney(value: number): string {
  return `฿${value.toFixed(0)}`
}

function goToCheckout() {
  router.push({ name: 'cart' })
}

function goToHome() {
  router.push({ name: 'home' })
}

async function submitPayment() {
  try {
    loading.value = true

    // 🔥 Replace with your real backend API
    const response = await axios.post(
      'http://localhost:8080/api/payments',
      {
        method: selectedMethod.value,
        amount: total.value,
        orderType: orderType.value,
        roomNo: roomNo.value
      }
    )

    if (response.data.status === 'PAID') {

      // Clear cart
      cartStore.clearCart?.()

      // Redirect with invoiceNo (IMPORTANT)
      router.push({
        name: 'order-success',
        query: {
          invoiceNo: response.data.invoiceNo
        }
      })
    }

  } catch (error) {
    console.error(error)
    alert('Payment failed.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped src="@/styles/customer/payment-page.css"></style>
