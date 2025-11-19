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

<style scoped>
.status-page {
  position: relative;
  background: radial-gradient(circle at top left, #fff7d6 0, #f9fafb 40%, #eef2ff 100%);
  min-height: 100vh;
  overflow: hidden;
}

/* background shapes */
.bg-shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.55;
  pointer-events: none;
  z-index: 0;
}

.bg-shape--one {
  width: 260px;
  height: 260px;
  background: #f97316;
  top: -60px;
  right: 8%;
  animation: floatShape 18s ease-in-out infinite;
}

.bg-shape--two {
  width: 220px;
  height: 220px;
  background: #a855f7;
  bottom: -80px;
  left: 4%;
  animation: floatShape 22s ease-in-out infinite;
}

.status-main {
  padding-block: 2.4rem 3.2rem;
  position: relative;
  z-index: 1;
}

/* ---------- HERO ---------- */
.hero {
  margin-bottom: 2.1rem;
}

.hero-header {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 1.2rem;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.35);
  backdrop-filter: blur(10px);
}

.hero-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

.hero-title {
  margin-top: 0.7rem;
  font-size: 1.6rem;
  font-weight: 700;
}

.hero-subtitle {
  margin-top: 0.4rem;
  font-size: 0.95rem;
}

/* summary card */
.summary-card {
  margin: 0 auto;
  margin-top: 1.1rem;
  max-width: 780px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  padding: 1rem 1.3rem 1.1rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(248, 250, 252, 0.95);
}

.summary-main {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
  border-bottom: 1px dashed #e5e7eb;
  padding-bottom: 0.7rem;
  margin-bottom: 0.7rem;
}

.summary-label {
  font-size: 0.72rem;
  color: #9ca3af;
}

.summary-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.summary-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
}

.summary-total {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.summary-total-label {
  color: #6b7280;
}

.summary-total-value {
  font-weight: 700;
}

.summary-items {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.summary-items-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

.summary-items-list {
  font-size: 0.85rem;
}

/* ---------- STATUS CARD ---------- */
.status-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  padding: 1.2rem 1.3rem 1.3rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(248, 250, 252, 0.95);
}

.status-header {
  margin-bottom: 0.8rem;
}

.section-title {
  font-size: 1.02rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.section-subtitle {
  font-size: 0.86rem;
  color: #6b7280;
}

/* progress track */
.progress-track {
  margin-bottom: 1rem;
}

.progress-line {
  position: relative;
  height: 4px;
  border-radius: 999px;
  background-color: #e5e7eb;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #facc15, #f97316);
  transition: width 0.25s ease-out;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
}

.progress-step {
  text-align: center;
  flex: 1;
}

.progress-icon {
  width: 20px;
  height: 20px;
  margin: 0 auto 0.15rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.progress-label {
  font-size: 0.72rem;
  color: #6b7280;
}

/* states */
.progress-step--done .progress-icon {
  background-color: #22c55e;
  color: #f9fafb;
}

.progress-step--current .progress-icon {
  background-color: #facc15;
  color: #111827;
}

.progress-step--upcoming .progress-icon {
  background-color: #e5e7eb;
  color: #6b7280;
}

/* step list */
.step-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.step-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.5rem;
  align-items: flex-start;
}

.step-badge {
  padding-top: 0.3rem;
}

.step-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background-color: #e5e7eb;
}

.step-item--done .step-dot {
  background-color: #22c55e;
}

.step-item--current .step-dot {
  background-color: #facc15;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.step-text {
  font-size: 0.82rem;
  color: #4b5563;
}

.step-extra {
  font-size: 0.78rem;
  color: #6b7280;
  margin-top: 0.15rem;
}

/* ---------- HELP SECTION ---------- */
.help-section {
  margin-top: 1.7rem;
}

.help-card {
  background: #0f172a;
  border-radius: 20px;
  padding: 1rem 1.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: #e5e7eb;
}

.help-title {
  font-size: 1rem;
  font-weight: 700;
}

.help-text {
  font-size: 0.86rem;
  color: #cbd5f5;
  max-width: 420px;
}

.help-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.help-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
}

.help-btn--primary {
  background-color: #facc15;
  color: #111827;
}

.help-btn--ghost {
  border: 1px solid rgba(148, 163, 184, 0.5);
  color: #e5e7eb;
}

/* animations */
@keyframes floatShape {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(12px, -16px, 0);
  }
}

/* responsive */
@media (max-width: 768px) {
  .summary-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .help-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
