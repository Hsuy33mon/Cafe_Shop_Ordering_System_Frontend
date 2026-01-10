<template>
  <div class="status-page">
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
              <p class="summary-value">#{{ order.id }}</p>
            </div>
            <div>
              <p class="summary-label">Room / Table</p>
              <p class="summary-value">
                {{ order.roomOrTable }} <span v-if="order.type">· {{ order.type }}</span>
              </p>
            </div>
            <div>
              <p class="summary-label">Placed</p>
              <p class="summary-value">{{ order.placedAt }}</p>
            </div>
            <div>
              <p class="summary-label">Estimated</p>
              <p class="summary-value">
                {{ order.estimatedReady }}<span v-if="etaNote"> · {{ etaNote }}</span>
              </p>
            </div>
          </div>

          <div class="summary-footer">
            <div class="summary-total">
              <span class="summary-total-label">Total</span>
              <span class="summary-total-value">฿{{ order.total }}</span>
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
import { computed, ref } from 'vue'

type OrderStatusKey = 'approved' | 'cooking' | 'finished' | 'delivering' | 'picked'

type OrderInfo = {
  id: number
  roomOrTable: string
  type: 'Room service' | 'Table' | 'Pick-up'
  placedAt: string
  estimatedReady: string
  total: number
  items: string[]
}

// mock current order info (replace with real API later)
const order = ref<OrderInfo>({
  id: 1042,
  roomOrTable: 'Room 1205',
  type: 'Room service',
  placedAt: 'Today · 10:12',
  estimatedReady: '10:35 – 10:45',
  total: 320,
  items: ['2 × Iced Caramel Latte', '1 × Chocolate Cake'],
})

// current status (in real app set from backend)
const currentStatus = ref<OrderStatusKey>('cooking')

const steps = computed(() => {
  const orderOfSteps: {
    key: OrderStatusKey
    label: string
    description: string
    extra?: string
  }[] = [
    {
      key: 'approved',
      label: 'Payment approved',
      description: 'Your order and payment have been received successfully.',
      extra: 'If you made a mistake, please contact us as soon as possible.',
    },
    {
      key: 'cooking',
      label: 'Start cooking',
      description: 'Our kitchen is preparing your food and drinks fresh to order.',
      extra: 'Typical prep time is 10–20 minutes depending on the queue.',
    },
    {
      key: 'finished',
      label: 'Finished & packed',
      description: 'Your order is ready and being checked before leaving the counter.',
      extra: 'Hot and cold items are packed separately to keep everything fresh.',
    },
    {
      key: 'delivering',
      label: 'Delivering to your room',
      description: 'Our staff is on the way to the room number you provided.',
      extra: 'Please keep your phone nearby in case we need to contact you.',
    },
    {
      key: 'picked',
      label: 'Picked at room',
      description: 'Order has been delivered and picked up at your room.',
      extra: 'Enjoy your meal and feel free to tag @cafeshop if you share a photo!',
    },
  ]

  const currentIndex = orderOfSteps.findIndex((s) => s.key === currentStatus.value)

  return orderOfSteps.map((step, index) => {
    let state: 'done' | 'current' | 'upcoming' = 'upcoming'
    if (index < currentIndex) state = 'done'
    if (index === currentIndex) state = 'current'
    return { ...step, state }
  })
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
  const items = order.value.items
  if (items.length === 0) return 'No items'
  if (items.length === 1) return items[0]
  return `${items[0]} + ${items.length - 1} more`
})

const etaNote = computed(() => {
  if (currentStatus.value === 'cooking') return 'Prep in progress'
  if (currentStatus.value === 'delivering') return 'Almost there'
  if (currentStatus.value === 'picked') return 'Completed'
  return ''
})
</script>

<style scoped src="@/styles/customer/order-status-page.css"></style>