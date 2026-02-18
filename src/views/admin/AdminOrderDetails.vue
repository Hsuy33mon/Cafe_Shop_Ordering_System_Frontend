<!-- src/views/admin/AdminOrderDetails.vue -->
<template>
  <main class="content order-details-page">
    <!-- GLOBAL MESSAGE -->
    <section
      v-if="lastUpdateMessage"
      class="order-global-message"
      :class="{ 'order-global-message--error': lastUpdateMessage.includes('Failed') }"
    >
      {{ lastUpdateMessage }}
    </section>

    <!-- HEADER -->
    <section class="panel order-header">
      <div class="order-header-left">
        <button class="btn-link" @click="goBack">← Back to orders</button>
        <h1 class="order-title">Order #{{ orderId }}</h1>
        <div class="order-subtitle receipt-meta" v-if="order">
          <div class="receipt-row">
            <span class="receipt-label">Date</span>
            <span class="receipt-value">{{ order.date }}</span>
          </div>

          <div class="receipt-row">
            <span class="receipt-label">Time</span>
            <span class="receipt-value">{{ order.time }}</span>
          </div>

          <div class="receipt-row">
            <span class="receipt-label">Channel</span>
            <span class="receipt-value">{{ order.channel }}</span>
          </div>

          <div class="receipt-row">
            <span class="receipt-label">Customer</span>
            <span class="receipt-value">{{ order.customer }}</span>
          </div>
        </div>
      </div>

      <div class="order-header-right" v-if="order">
        <span class="order-status-pill" :class="statusClass(order.status)">
          {{ order.status }}
        </span>
        <span class="order-payment-pill">
          {{ order.paymentStatus }}
        </span>
      </div>
    </section>

    <section v-if="!order" class="panel order-not-found">
      <p>Order not found.</p>
    </section>

    <section v-else class="order-layout">
      <!-- LEFT: ITEMS -->
      <article class="panel order-items-panel">
        <h2 class="panel-title">Items</h2>

        <table class="order-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Size</th>
              <th class="col-price">Price (฿)</th>
              <th class="col-qty">Qty</th>
              <th class="col-total">Total (฿)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in order.items" :key="item.id">
              <tr>
                <td>
                  <div class="item-name">{{ item.name }}</div>
                </td>
                <td>
                  <span class="item-size">{{ item.size || '-' }}</span>
                </td>
                <td class="col-price">{{ item.unitPrice }}</td>
                <td class="col-qty">{{ item.quantity }}</td>
                <td class="col-total">{{ item.total }}</td>
              </tr>
              <h2 class="panel-title">Ingredients</h2>
              <tr v-if="item.orderIngredients?.length">
                <td colspan="5" class="ingredients-wrapper">
                  <table class="ingredients-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Price (฿)</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="ing in item.orderIngredients" :key="ing.id">
                        <td>{{ ing.ingredientName }}</td>
                        <td>{{ getIngredientAmount(item, ing.ingredientId) }}</td>
                        <td>{{ getIngredientPrice(item, ing.ingredientId) }}</td>
                        <td>{{ ing.note || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </article>

      <!-- RIGHT SIDE: SUMMARY + NOTE + UPDATE FORM -->
      <aside class="order-side">
        <!-- SUMMARY -->
        <article class="panel order-summary-panel">
          <h2 class="panel-title">Summary</h2>

          <dl class="summary-list">
            <div class="summary-row summary-row--total">
              <dt>Subtotal</dt>
              <dd>฿{{ order.total }}</dd>
            </div>

            <div class="summary-row">
              <dt>Items</dt>
              <dd>฿{{ itemsTotal }}</dd>
            </div>

            <div class="summary-row">
              <dt>Ingredients</dt>
              <dd>฿{{ ingredientsTotal }}</dd>
            </div>

            <div class="summary-row summary-row--total">
              <dt>Total</dt>
              <dd>฿{{ grandTotal }}</dd>
            </div>
          </dl>
        </article>

        <!-- CUSTOMER NOTE -->
        <article class="panel order-note-panel">
          <h2 class="panel-title">Customer note</h2>
          <p class="order-note-text">
            {{ order.customerNote || 'No note from customer.' }}
          </p>
        </article>

        <!-- STATUS / PAYMENT UPDATE -->
        <article class="panel order-manage-panel">
          <h2 class="panel-title">Status & payment</h2>

          <label class="manage-field">
            <span class="manage-label">Order status</span>
            <select v-model="editStatus" class="manage-select">
              <option v-for="opt in statusOptions" :key="opt" :value="opt">
                {{ STATUS_LABELS[opt] }}
              </option>
            </select>
          </label>

          <label class="manage-field">
            <span class="manage-label">Payment status</span>
            <select v-model="editPaymentStatus" class="manage-select">
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
            </select>
          </label>

          <label class="manage-field">
            <span class="manage-label">Payment type</span>
            <select
              v-model="editPaymentType"
              class="manage-select"
              :disabled="editPaymentStatus === 'UNPAID'"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="QR">QR</option>
            </select>
          </label>

          <button class="manage-btn-primary" @click="applyOrderUpdate">Update order</button>

          <!-- <p v-if="lastUpdateMessage" class="manage-hint">
            {{ lastUpdateMessage }}
          </p> -->
          <!-- <div
  v-if="lastUpdateMessage"
  class="manage-message"
  :class="{ 'manage-message--error': lastUpdateMessage.includes('Failed') }"
>
  {{ lastUpdateMessage }}
</div> -->
        </article>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useOrdersStore, type OrderStatus } from '@/stores/useOrderStore'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* =======================
   Router & Store
======================= */
const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const itemsTotal = computed(
  () => order.value?.items.reduce((sum: number, item: any) => sum + item.total, 0) || 0,
)

const ingredientsTotal = computed(
  () =>
    order.value?.items.reduce((sum: number, item: any) => sum + ingredientTotalForItem(item), 0) ||
    0,
)

const grandTotal = computed(() => itemsTotal.value + ingredientsTotal.value)

const orderId = computed(() => Number(route.params.id))

onMounted(async () => {
  await ordersStore.fetchById(orderId.value)
})

/* =======================
   Order (from backend)
======================= */
const order = computed(() => ordersStore.currentOrder)

/* =======================
   Payment (frontend-only for now)
======================= */
type PaymentStatus = 'UNPAID' | 'PAID'
type PaymentType = 'CASH' | 'CARD' | 'QR'

// const paymentStatusOptions: PaymentStatus[] = ['UNPAID', 'PAID']
// const paymentTypeOptions: PaymentType[] = ['CASH', 'CARD', 'QR']

/* =======================
   Status Update Form
======================= */
const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready to serve',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}
const statusOptions: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'COMPLETED',
  'CANCELLED',
]

const editStatus = ref<OrderStatus>('PENDING')
const lastUpdateMessage = ref('')
const editPaymentStatus = ref<PaymentStatus>('UNPAID')
const editPaymentType = ref<PaymentType>('CASH')

watch(order, (o) => {
  if (!o) return

  editStatus.value = o.status
  editPaymentStatus.value = o.paymentStatus
  // ✅ only set payment type if paid
  editPaymentType.value = 'CASH'
})

/* =======================
   Update Order (API)
======================= */
async function applyOrderUpdate() {
  if (!order.value) return

  lastUpdateMessage.value = ''

  try {
    await ordersStore.update(order.value.id, {
      status: editStatus.value,
      paymentStatus: editPaymentStatus.value,
      paymentType: editPaymentType.value,
    })

    lastUpdateMessage.value = 'Order updated successfully. Redirecting to orders...'

    setTimeout(() => {
      router.push({ name: 'admin-orders' })
    }, 1500)
  } catch (e) {
    console.error(e)
    lastUpdateMessage.value = 'Failed to update order. Please try again.'
  }
}

/* =======================
   Navigation
======================= */
function goBack() {
  router.push({ name: 'admin-orders' })
}

/* =======================
   Status UI helper
======================= */
function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'PENDING',
    'status-pill--prep': status === 'PREPARING',
    'status-pill--ready': status === 'READY',
    'status-pill--paid': status === 'COMPLETED',
    'status-pill--cancel': status === 'CANCELLED',
  }
}

function getIngredientAmount(item: any, ingredientId: number) {
  const ingredient = item.menuItem?.ingredients?.find(
    (i: any) => Number(i.id) === Number(ingredientId),
  )
  return ingredient?.amount ?? '-'
}

function getIngredientPrice(item: any, ingredientId: number) {
  const ingredient = item.menuItem?.ingredients?.find(
    (i: any) => Number(i.id) === Number(ingredientId),
  )
  return ingredient?.price ?? 0
}

function ingredientTotalForItem(item: any) {
  if (!item.orderIngredients?.length) return 0

  return item.orderIngredients.reduce((sum: number, ing: any) => {
    const price = getIngredientPrice(item, ing.ingredientId)
    return sum + price
  }, 0)
}
</script>

<style scoped src="@/styles/admin/order-details.css"></style>
