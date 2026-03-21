<!-- src/views/PaymentSuccess.vue -->
<template>
  <div class="ps-page">
    <!-- background -->
    <div class="ps-bg">
      <span class="orb orb--1"></span>
      <span class="orb orb--2"></span>
      <span class="orb orb--3"></span>
    </div>

    <main class="ps-main">
      <section class="ps-card" role="status" aria-live="polite">
        <div class="ps-icon-wrap">
          <svg class="ps-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 7L10.5 16.5L4 10"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h1 class="ps-title">Payment successful</h1>
        <p class="ps-sub">
          Thank you! Your payment has been confirmed. We’re preparing your order now.
        </p>

        <div class="ps-divider"></div>

        <div class="ps-meta">
          <div class="meta-row">
            <span class="meta-label">Customer</span>
            <span class="meta-value">{{ customerName }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">{{ placeLabel }}</span>
            <span class="meta-value">{{ placeText }}</span>
          </div>
        </div>

        <div class="ps-actions">
          <button class="btn btn-ghost" @click="goShop">Back to shop</button>
          <button class="btn btn-ghost" @click="goOrders">Track Orders</button>
        </div>

        <p class="ps-note">If you have any issue, please contact our staff and show this screen.</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useOrderSessionStore } from '@/stores/orderSession'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const session = useOrderSessionStore()

const customerName = computed(() => session.customerName || 'Customer')
const placeLabel = computed(() => (session.orderType === 'ROOM' ? 'Room' : 'Table'))
const placeText = computed(() => {
  const no = session.placeNumber || session.tableNumber || '-'
  return session.orderType === 'ROOM' ? `Room ${no}` : `Table ${no}`
})

const invoiceId = Number(route.query.invoiceId)

if (invoiceId) {
  let invoiceIds = JSON.parse(localStorage.getItem('invoiceIds') || '[]')

  if (!invoiceIds.includes(invoiceId)) {
    invoiceIds.push(invoiceId)
  }

  localStorage.setItem('invoiceIds', JSON.stringify(invoiceIds))
}

function goOrders() {
  const invoiceId = Number(route.query.invoiceId)

  router.push({
    name: 'orders-invoice',
    params: { invoiceId },
  })
}

function goShop() {
  router.push({ name: 'shop' })
}
</script>

<style scoped>
/* page */
.ps-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #f6f8ff;
  display: grid;
  place-items: center;
  padding: 24px;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    'Apple Color Emoji',
    'Segoe UI Emoji';
}

/* background orbs */
.ps-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.55;
  transform: translateZ(0);
  animation: float 9s ease-in-out infinite;
}

.orb--1 {
  width: 320px;
  height: 320px;
  left: -80px;
  top: -80px;
  background: radial-gradient(circle at 30% 30%, #ffd6a6, #ff7a59);
}
.orb--2 {
  width: 380px;
  height: 380px;
  right: -140px;
  top: 80px;
  background: radial-gradient(circle at 30% 30%, #b9c9ff, #6a78ff);
  animation-delay: -2s;
}
.orb--3 {
  width: 340px;
  height: 340px;
  left: 40%;
  bottom: -180px;
  background: radial-gradient(circle at 30% 30%, #bff7d3, #3ddc97);
  animation-delay: -4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

/* card */
.ps-main {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 1;
}

.ps-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(120, 130, 255, 0.18);
  box-shadow: 0 18px 40px rgba(20, 30, 80, 0.12);
  border-radius: 22px;
  padding: 26px 22px;
  backdrop-filter: blur(10px);
  text-align: center;
}

.ps-icon-wrap {
  width: 74px;
  height: 74px;
  margin: 4px auto 12px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(61, 220, 151, 0.2), rgba(106, 120, 255, 0.16));
  display: grid;
  place-items: center;
}

.ps-icon {
  width: 44px;
  height: 44px;
  color: #1c8f5a;
}

.ps-title {
  margin: 8px 0 6px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.ps-sub {
  margin: 0;
  color: #475569;
  line-height: 1.45;
  font-size: 0.98rem;
}

.ps-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.12), transparent);
  margin: 18px 0;
}

.ps-meta {
  display: grid;
  gap: 10px;
  text-align: left;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 14px 14px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}

.meta-label {
  color: #64748b;
  font-size: 0.9rem;
}

.meta-value {
  color: #0f172a;
  font-weight: 700;
  font-size: 0.95rem;
}

.ps-actions {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.btn {
  border: 0;
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.08s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background: linear-gradient(135deg, #ffb23f, #ff7a18);
  color: #1a1200;
  box-shadow: 0 12px 26px rgba(255, 122, 24, 0.28);
}

.btn-primary:hover {
  box-shadow: 0 14px 30px rgba(255, 122, 24, 0.34);
}

.btn-ghost {
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}

.btn-ghost:hover {
  background: rgba(15, 23, 42, 0.09);
}

.ps-note {
  margin: 14px 0 0;
  font-size: 0.86rem;
  color: #64748b;
}

/* small screens */
@media (max-width: 420px) {
  .ps-card {
    padding: 22px 16px;
    border-radius: 20px;
  }
  .ps-title {
    font-size: 1.45rem;
  }
}
</style>
