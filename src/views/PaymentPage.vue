<template>
  <div class="payment-page">
    <!-- PAGE HEADER / COVER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Payment</h1>

        <div class="breadcrumb-pill">
                    <span
  class="crumb crumb--link"
  @click="goToHome"
>
  Home
</span>
          <span class="crumb-sep">/</span>
          <span
  class="crumb crumb--link"
  @click="goToCheckout"
>
  Checkout
</span>
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

            <!-- totals -->
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
import { useCartStore } from '../stores/useCartStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const items = computed(() => cartStore.items)

const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)
const total = computed(() =>
  subtotal.value
)


type OrderType = 'shop' | 'room'
type PaymentMethod = 'card' | 'promptpay'


// Mock order data – later you can replace with props / store
const orderType = ref<OrderType>('room')
const roomNo = ref('1205')


// payment state
const selectedMethod = ref<PaymentMethod>('card')
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

function formatMoney(value: number): string {
  return `฿${value.toFixed(0)}`
}

function goToCheckout(){
  router.push({ name: 'cart' })
}
function goToHome(){
  router.push({ name: 'home' })
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

<style scoped src="@/styles/customer/payment-page.css"></style>
