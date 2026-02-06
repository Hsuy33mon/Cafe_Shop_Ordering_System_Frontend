<!-- src/views/admin/AdminOrderDetails.vue -->
<template>
  <main class="content order-details-page">
    <!-- HEADER -->
    <section class="panel order-header">
      <div class="order-header-left">
        <button class="btn-link" @click="goBack">← Back to orders</button>
        <h1 class="order-title">Order #{{ orderId }}</h1>
        <!-- <p class="order-subtitle" v-if="order">
          {{ order.date }} · {{ order.time }} · {{ order.channel }} ·
          {{ order.customer }}
        </p> -->

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
            <tr v-for="item in order.items" :key="item.name">
              <td>
                <div class="item-name">{{ item.name }}</div>
                <div v-if="item.note" class="item-note">
                  {{ item.note }}
                </div>
              </td>
              <td>
                <span v-if="item.size" class="item-size">
                {{ item.size }}
                </span>
              </td>
              <td class="col-price">{{ item.unitPrice }}</td>
              <td class="col-qty">{{ item.quantity }}</td>
              <td class="col-total">{{ item.total }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <!-- RIGHT SIDE: SUMMARY + NOTE + UPDATE FORM -->
      <aside class="order-side">
        <!-- SUMMARY -->
        <article class="panel order-summary-panel">
          <h2 class="panel-title">Summary</h2>

          <dl class="summary-list">
            <div class="summary-row">
              <dt>Subtotal</dt>
              <dd>฿{{ order.subtotal }}</dd>
            </div>
            <div class="summary-row">
              <dt>Service charge</dt>
              <dd>฿{{ order.serviceCharge }}</dd>
            </div>
            <div class="summary-row">
              <dt>Tax</dt>
              <dd>฿{{ order.tax }}</dd>
            </div>
            <div class="summary-row summary-row--total">
              <dt>Total</dt>
              <dd>฿{{ order.total }}</dd>
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
                {{ opt }}
              </option>
            </select>
          </label>

          <label class="manage-field">
            <span class="manage-label">Payment status / type</span>
            <select v-model="editPaymentStatus" class="manage-select">
              <option v-for="opt in paymentStatusOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </label>

          <button class="manage-btn-primary" @click="applyOrderUpdates">Update order</button>

          <p v-if="lastUpdateMessage" class="manage-hint">
            {{ lastUpdateMessage }}
          </p>
        </article>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore, type OrderStatus } from '@/stores/useOrderStore'

/* =======================
   Router & Store
======================= */
const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

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
type PaymentStatus = 'Unpaid' | 'Paid (Cash)' | 'Paid (Card)' | 'Paid (QR)'

const paymentStatusOptions: PaymentStatus[] = [
  'Unpaid',
  'Paid (Cash)',
  'Paid (Card)',
  'Paid (QR)',
]

/* =======================
   Status Update Form
======================= */
const statusOptions: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'SERVED',
  'CANCELLED',
]

const editStatus = ref<OrderStatus>('PENDING')
const editPaymentStatus = ref<PaymentStatus>('Unpaid')
const lastUpdateMessage = ref('')

watch(
  order,
  (o) => {
    if (!o) return
    editStatus.value = o.status
    editPaymentStatus.value = o.paymentStatus
    lastUpdateMessage.value = ''
  },
  { immediate: true },
)

/* =======================
   Update Order (API)
======================= */
async function applyOrderUpdates() {
  if (!order.value) return

  await ordersStore.update(order.value.id, {
    status: editStatus.value,
  })

  lastUpdateMessage.value = 'Order updated successfully.'
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
    'status-pill--ready': status === 'SERVED',
    'status-pill--paid': status === 'CONFIRMED',
  }
}
</script>

<style scoped src="@/styles/admin/order-details.css"></style>
