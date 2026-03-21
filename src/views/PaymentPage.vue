<template>
  <div class="payment-page">
    <!-- PAGE HEADER / COVER -->
    <section class="checkout-hero">
      <div class="cs-container checkout-hero-inner">
        <h1 class="checkout-title">Payment Method</h1>

        <div class="breadcrumb-pill">
          <span class="crumb crumb--link" @click="goToHome"> Home </span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--link" @click="goToCheckout"> Checkout </span>
          <span class="crumb-sep">/</span>
          <span class="crumb crumb--active">Method</span>
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

            <div class="order-session-info">
              <div class="session-row">
                <span class="session-label">Customer</span>
                <span class="session-value">{{ customerName }}</span>
              </div>

              <div class="session-row">
                <span class="session-label">Order type</span>
                <span class="session-value">{{ orderTypeLabel }}</span>
              </div>

              <div
                v-if="session.orderType === 'ROOM' || session.orderType === 'TABLE'"
                class="session-row"
              >
                <span class="session-label">
                  {{ session.orderType === 'ROOM' ? 'Room number' : 'Table number' }}
                </span>
                <span class="session-value">{{ placeNumber }}</span>
              </div>
            </div>

            <hr class="divider" />

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
                    <!-- <p class="item-desc">{{ item.description }}</p> -->
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
                <span>{{ formatMoney(subtotal - totalIngredientPrice) }}</span>
              </div>

              <div class="totals-row">
                <span>Ingredients</span>
                <span>{{ formatMoney(totalIngredientPrice) }}</span>
              </div>

              <!-- VAT -->
              <div class="totals-row">
                <span>
                  VAT
                  <template v-if="vatType === 'PERCENTAGE'"> ({{ vatRate }}%) </template>
                </span>
                <span>{{ formatMoney(vatAmount) }}</span>
              </div>

              <div class="totals-divider"></div>

              <!-- GRAND TOTAL -->
              <div class="totals-row totals-row--strong">
                <span>Grand Total</span>
                <span class="total-highlight">
                  {{ formatMoney(grandTotal) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: CHOOSE METHOD ONLY -->
        <section class="payment-right">
          <div class="pay-card">
            <h2 class="section-title">Choose payment method</h2>

            <!-- Method choices (no payment creation here) -->
            <div class="method-list">
              <label class="method-option" :class="{ active: selectedMethod === 'promptpay' }">
                <input type="radio" name="payment" value="promptpay" v-model="selectedMethod" />
                <span class="method-icon">📱</span>
                <div class="method-text">
                  <div class="method-title">PromptPay (QR)</div>
                  <div class="method-desc">Scan QR in the next step</div>
                </div>
              </label>

              <label class="method-option" :class="{ active: selectedMethod === 'cash' }">
                <input type="radio" name="payment" value="cash" v-model="selectedMethod" />
                <span class="method-icon">💵</span>
                <div class="method-text">
                  <div class="method-title">Cash</div>
                  <div class="method-desc">Confirm cash payment in the next step</div>
                </div>
              </label>
            </div>

            <hr class="divider" />

            <p class="pay-note">
              No payment is created yet. You will complete the payment on the next page.
            </p>

            <div class="actions">
              <button type="button" class="btn-secondary" @click="goToCheckout">Back</button>
              <button type="button" class="pay-btn" @click="goToPayStep">
                Continue – {{ formatMoney(grandTotal) }}
              </button>
            </div>
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
import { useOrderSessionStore } from '@/stores/orderSession'
import { useVat } from '@/composables/useVat'

const router = useRouter()
const cartStore = useCartStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)

const total = computed(() => subtotal.value)

const { vatRate, vatType, vatAmount, grandTotal } = useVat(total)

const session = useOrderSessionStore()
session.hydrate()

type PaymentMethod = 'card' | 'promptpay' | 'cash'

const customerName = computed(() => session.customerName)

const orderTypeLabel = computed(() =>
  session.orderType === 'ROOM' ? 'Room delivery' : 'Take in shop',
)

const placeNumber = computed(() => session.placeNumber || session.tableNumber || '')

// choose only
const selectedMethod = ref<PaymentMethod>('promptpay')

function formatMoney(value: number): string {
  return `฿${value.toFixed(2)}`
}

function goToCheckout() {
  router.push({ name: 'cart' })
}
function goToHome() {
  router.push({ name: 'home' })
}
function goToPayStep() {
  router.push({
    name: 'checkoutPay',
    params: { method: selectedMethod.value },
  })
}
</script>

<style scoped src="@/styles/customer/payment-page.css"></style>
