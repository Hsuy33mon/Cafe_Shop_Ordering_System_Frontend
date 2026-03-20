<template>
  <div v-if="!order">Loading...</div>
  <div v-else class="status-page">
    <!-- soft background -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <main class="status-main">
      <!-- HERO / HEADER -->
      <section class="cs-container hero">
        <div class="hero-header">
          <span class="hero-pill">Order status</span>
          <h1 class="hero-title">Your order is on its way ☕</h1>
          <p class="hero-subtitle cs-body-muted">
            We’ve received your payment and our team is preparing your items. You can relax — we’ll
            bring everything straight to your room.
          </p>
        </div>

        <!-- ORDER SUMMARY CARD -->
        <div class="summary-card">
          <div class="summary-main">
            <div>
              <p class="summary-label">Order ID</p>
              <p class="summary-value">#{{ mappedOrder.id }}</p>
            </div>
            <div>
              <p class="summary-label">Room / Table</p>
              <p class="summary-value">
                {{ mappedOrder.roomOrTable }} <span v-if="mappedOrder.type">· {{ mappedOrder.type }}</span>
              </p>
            </div>
            <div>
              <p class="summary-label">Placed</p>
              <p class="summary-value">{{ mappedOrder.placedAt }}</p>
            </div>
            <div>
              <p class="summary-label">Estimated</p>
              <p class="summary-value">
                {{ mappedOrder.estimatedReady }}<span v-if="etaNote"> · {{ etaNote }}</span>
              </p>
            </div>
          </div>

          <div class="summary-footer">
            <div class="summary-total">
              <span class="summary-total-label">Total</span>
              <span class="summary-total-value">฿{{ mappedOrder.total }}</span>
            </div>
            <div class="summary-items">
              <span class="summary-items-label">Items</span>
              <span class="summary-items-list">
                {{ shortItems }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- PROGRESS SECTION -->
      <section class="cs-container">
        <div class="status-card">
          <div class="status-header">
            <h2 class="section-title">Order progress</h2>
            <p class="section-subtitle">
              Follow your order from approval to delivery at your room.
            </p>
          </div>

          <!-- progress line -->
          <div class="progress-track">
            <div class="progress-line">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>

            <div class="progress-steps">
              <div
                v-for="step in steps"
                :key="step.key"
                class="progress-step"
                :class="[
                  `progress-step--${step.state}`,
                  step.key === currentStatus ? 'progress-step--current' : '',
                ]"
              >
                <div class="progress-icon">
                  <span v-if="step.state === 'done'">✓</span>
                  <span v-else-if="step.state === 'current'">●</span>
                  <span v-else>○</span>
                </div>
                <p class="progress-label">{{ step.label }}</p>
              </div>
            </div>
          </div>

          <!-- step details list -->
          <ul class="step-list">
            <li
              v-for="step in steps"
              :key="step.key + '-detail'"
              class="step-item"
              :class="`step-item--${step.state}`"
            >
              <div class="step-badge">
                <span class="step-dot"></span>
              </div>
              <div class="step-body">
                <p class="step-title">{{ step.label }}</p>
                <p class="step-text">{{ step.description }}</p>

                <p v-if="step.extra" class="step-extra">
                  {{ step.extra }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- HELP SECTION -->
      <section class="cs-container help-section">
        <div class="help-card">
          <div>
            <h3 class="help-title">Need to update your order?</h3>
            <p class="help-text">
              If you need to change room number, add cutlery or adjust anything, please contact our
              team immediately.
            </p>
          </div>
          <div class="help-actions">
            <a href="tel:+66000000000" class="help-btn help-btn--primary"> Call CafeShop </a>
            <a href="mailto:hello@cafeshop.local" class="help-btn help-btn--ghost"> Message us </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useOrdersStore } from '../stores/useOrderStore'
import { useRoute } from 'vue-router'

const ordersStore = useOrdersStore()
const route = useRoute()

const order = computed(() => ordersStore.currentOrder)

onMounted(async () => {
  const id = Number(route.params.id)
  console.log('Fetching order ID:', id)

  await ordersStore.fetchById(id)

  console.log('STORE ORDER:', ordersStore.currentOrder)
})

const currentStatus = computed(() => {
  const s = order.value?.status

  if (s === 'PENDING') return 'approved'
  if (s === 'CONFIRMED') return 'approved'
  if (s === 'PREPARING') return 'cooking'
  if (s === 'READY') return 'finished'
  if (s === 'COMPLETED') return 'picked'

  return 'approved'
})


const mappedOrder = computed(() => {
  if (!order.value) return null

  return {
    id: order.value.id,
    roomOrTable: order.value.tableNo || '-',
    type: order.value.channel,
    placedAt: `${order.value.date} ${order.value.time}`,
    estimatedReady: '20–25 min',
    total: order.value.total,
    items: order.value.items.map(
      (i) => `${i.quantity} × ${i.name}`
    ),
  }
})


const progressPercent = computed(() => {
  const list = steps.value
  const total = list.length
  const index = list.findIndex((s) => s.key === currentStatus.value)

  if (index <= 0) return 0
  if (index >= total - 1) return 100
  return Math.round((index / (total - 1)) * 100)
})

const shortItems = computed(() => {
  const items = mappedOrder.value?.items || []
  if (items.length === 0) return 'No items'
  if (items.length === 1) return items[0]
  return `${items[0]} + ${items.length - 1} more`
})

// const etaNote = computed(() => {
//   if (currentStatus.value === 'cooking') return 'Prep in progress'
//   if (currentStatus.value === 'delivering') return 'Almost there'
//   if (currentStatus.value === 'picked') return 'Completed'
//   return ''
// })
</script>

<style scoped src="@/styles/customer/order-status-page.css"></style>
