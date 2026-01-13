<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrderSessionStore } from '@/stores/orderSession'

const router = useRouter()
const route = useRoute()

const goToCart = () => router.push('/cart')

const session = useOrderSessionStore()
session.hydrate()

const sessionLabel = computed(() => {
  if (!session.isReady) return ''
  return `${session.customerName} • Table ${session.tableNumber}`
})

const isMobileMenuOpen = ref(false)
const cartCount = ref(5)

function closeMobile() {
  isMobileMenuOpen.value = false
}

// ✅ active helper
function isActive(basePath: string, exact = true) {
  if (exact) return route.path === basePath
  return route.path === basePath || route.path.startsWith(basePath + '/')
}
</script>

<template>
  <!-- NAVBAR -->
  <header class="navbar">
    <div class="cs-container navbar-inner">
      <!-- LEFT: LOGO -->
      <div class="navbar-logo">
        <div class="logo-icon">☕</div>
        <div class="logo-text">CafeShop</div>
      </div>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" :class="{ 'nav-link--active': isActive('/') }"
          >Home</RouterLink
        >

        <RouterLink
          to="/about"
          class="nav-link"
          :class="{ 'nav-link--active': isActive('/about') }"
        >
          About
        </RouterLink>

        <RouterLink
          to="/products"
          class="nav-link"
          :class="{ 'nav-link--active': isActive('/products') }"
        >
          Menu
        </RouterLink>

        <RouterLink to="/shop" class="nav-link" :class="{ 'nav-link--active': isActive('/shop') }">
          Shop
        </RouterLink>

        <!-- ✅ inclusive for /orders and /orders/:id -->
        <RouterLink
          to="/orders"
          class="nav-link"
          :class="{ 'nav-link--active': isActive('/orders', false) }"
        >
          Orders
        </RouterLink>

        <RouterLink
          to="/contact"
          class="nav-link"
          :class="{ 'nav-link--active': isActive('/contact') }"
        >
          Contact
        </RouterLink>
      </nav>

      <!-- RIGHT: PURCHASE / BAG + HAMBURGER -->
      <div class="navbar-actions">
        <button type="button" class="purchase-btn" @click="goToCart">
          <span class="purchase-icon">🛍</span>
          <span class="purchase-label">Purchase</span>
          <span v-if="cartCount > 0" class="purchase-count">{{ cartCount }}</span>
        </button>

        <button
          type="button"
          class="menu-btn"
          :class="{ 'menu-btn--open': isMobileMenuOpen }"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="menu-bar" />
          <span class="menu-bar" />
        </button>
        <div v-if="sessionLabel" class="session-pill" title="Current session">
          {{ sessionLabel }}
        </div>
      </div>
    </div>
    <transition name="fade-down">
      <nav v-if="isMobileMenuOpen" class="mobile-menu">
        <RouterLink
          to="/"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/') }"
          @click="closeMobile"
          >Home</RouterLink
        >
        <RouterLink
          to="/about"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/about') }"
          @click="closeMobile"
          >About</RouterLink
        >
        <RouterLink
          to="/products"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/products') }"
          @click="closeMobile"
          >Menu</RouterLink
        >
        <RouterLink
          to="/shop"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/shop') }"
          @click="closeMobile"
          >Shop</RouterLink
        >
        <RouterLink
          to="/orders"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/orders', false) }"
          @click="closeMobile"
          >Orders</RouterLink
        >
        <RouterLink
          to="/contact"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/contact') }"
          @click="closeMobile"
          >Contact</RouterLink
        >
        <RouterLink
          to="/cart"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/cart') }"
          @click="closeMobile"
          >Purchase</RouterLink
        >
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: #ffffff;
  border-bottom: 1px solid #f3f4f6;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background-color: #facc15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.logo-text {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.nav-links {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  font-size: 0.92rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #111827;
  opacity: 0.7;
  padding-left: 0; /* will shift when active */
  transition:
    opacity 0.16s ease,
    color 0.16s ease,
    padding-left 0.16s ease;
}

/* yellow dot bullet when active (Starbelly style) */
.nav-link--active {
  opacity: 1;
  color: #111827;
  padding-left: 0.8rem;
  font-weight: 500;
}

.nav-link--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: #facc15;
  transform: translateY(-50%);
}

.nav-link:hover {
  opacity: 1;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.purchase-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.3rem;
  border-radius: 0;
  border: none;
  background-color: #facc15;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.purchase-icon {
  font-size: 1rem;
}

.purchase-count {
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background-color: #111827;
  color: #f9fafb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.menu-btn {
  display: none;
  border: none;
  background: none;
  padding: 0.25rem;
  flex-direction: column;
  gap: 0.22rem;
  cursor: pointer;
}

.menu-bar {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background-color: #111827;
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.menu-btn--open .menu-bar:nth-child(1) {
  transform: translateY(3px) rotate(45deg);
}
.menu-btn--open .menu-bar:nth-child(2) {
  transform: translateY(-3px) rotate(-45deg);
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .purchase-btn {
    display: none;
  }

  .menu-btn {
    display: inline-flex;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-top: 1px solid #f3f4f6;
  }

  .mobile-link {
    padding: 0.9rem 1.5rem;
    text-decoration: none;
    font-size: 0.95rem;
    color: #111827;
    border-bottom: 1px solid #f3f4f6;
  }

  .mobile-link:last-child {
    border-bottom: none;
  }
}

/* transition for <transition name="fade-down"> */
.fade-down-enter-active,
.fade-down-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Desktop session pill */
.session-pill {
  max-width: 280px;
  padding: 0.45rem 0.7rem;
  border: 1px solid #f3f4f6;
  background: #fff;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #111827;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile session block */
.mobile-session {
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: #fffbeb; /* light cafe yellow */
}

.mobile-session-title {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.mobile-session-value {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}
</style>
