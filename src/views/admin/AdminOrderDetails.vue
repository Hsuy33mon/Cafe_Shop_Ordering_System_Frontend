<!-- src/views/admin/AdminOrderDetails.vue -->
<template>
  <main class="content order-details-page">
    <!-- HEADER -->
    <section class="panel order-header">
      <div class="order-header-left">
        <button class="btn-link" @click="goBack">← Back to orders</button>
        <h1 class="order-title">Order #{{ orderId }}</h1>
        <p class="order-subtitle" v-if="order">
          {{ order.date }} · {{ order.time }} · {{ order.channel }} ·
          {{ order.customer }}
        </p>
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
              <th class="col-qty">Qty</th>
              <th class="col-price">Price (฿)</th>
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
              <td class="col-qty">{{ item.quantity }}</td>
              <td class="col-price">{{ item.unitPrice }}</td>
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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Canceled'
type PaymentStatus = 'Unpaid' | 'Paid (Cash)' | 'Paid (Card)' | 'Paid (QR)'

type OrderItem = {
  name: string
  quantity: number
  unitPrice: number
  total: number
  note?: string
}

type OrderDetails = {
  id: number
  date: string
  time: string
  customer: string
  channel: 'Cafe' | 'Room' | 'Take-away'
  status: OrderStatus
  paymentStatus: PaymentStatus
  customerNote?: string
  items: OrderItem[]
  subtotal: number
  serviceCharge: number
  tax: number
  total: number
}

const route = useRoute()
const router = useRouter()

const orderId = computed(() => Number(route.params.id))

// Demo data – later you can replace with API call
const dummyOrders: Record<number, OrderDetails> = {
  1050: {
    id: 1050,
    date: '2025-11-20',
    time: '11:20',
    customer: 'Room 1205',
    channel: 'Room',
    status: 'New',
    paymentStatus: 'Unpaid',
    customerNote: 'Please no sugar in the iced latte.',
    items: [
      {
        name: 'Iced Latte',
        quantity: 2,
        unitPrice: 90,
        total: 180,
      },
      {
        name: 'Chocolate Cake',
        quantity: 1,
        unitPrice: 140,
        total: 140,
        note: 'Slice for one person',
      },
    ],
    subtotal: 320,
    serviceCharge: 0,
    tax: 0,
    total: 320,
  },
  1049: {
    id: 1049,
    date: '2025-11-20',
    time: '11:10',
    customer: 'Walk-in',
    channel: 'Cafe',
    status: 'Completed',
    paymentStatus: 'Paid (Card)',
    customerNote: '',
    items: [
      {
        name: 'Gourmet Burger set',
        quantity: 1,
        unitPrice: 260,
        total: 260,
      },
    ],
    subtotal: 260,
    serviceCharge: 0,
    tax: 0,
    total: 260,
  },
  // add more dummy orders as needed
}

const order = computed<OrderDetails | null>(() => {
  const id = orderId.value
  return dummyOrders[id] ?? null
})

// --- update form state ---
const statusOptions: OrderStatus[] = ['New', 'Preparing', 'Ready', 'Completed', 'Canceled']
const paymentStatusOptions: PaymentStatus[] = ['Unpaid', 'Paid (Cash)', 'Paid (Card)', 'Paid (QR)']

const editStatus = ref<OrderStatus>('New')
const editPaymentStatus = ref<PaymentStatus>('Unpaid')
const lastUpdateMessage = ref('')

// sync selects whenever order changes
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

function applyOrderUpdates() {
  if (!order.value) return

  // mutate current order (dummy data or later your API model)
  order.value.status = editStatus.value
  order.value.paymentStatus = editPaymentStatus.value

  // here, in real app, call your API to persist changes
  // await api.updateOrder(order.value.id, { status: editStatus.value, paymentStatus: editPaymentStatus.value })

  lastUpdateMessage.value = 'Order updated (demo only – not persisted).'
}

function goBack() {
  router.push({ name: 'admin-orders' })
}

function statusClass(status: OrderStatus) {
  return {
    'status-pill--new': status === 'New',
    'status-pill--prep': status === 'Preparing',
    'status-pill--ready': status === 'Ready',
    'status-pill--paid': status === 'Completed',
  }
}
</script>

<style scoped src="@/styles/admin/order-details.css"></style>
