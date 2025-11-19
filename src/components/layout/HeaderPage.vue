<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCart = () => {
  router.push('/cart')
}

const isMobileMenuOpen = ref(false)
const cartCount = ref(5)

function closeMobile() {
  isMobileMenuOpen.value = false
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

      <!-- CENTER: NAV LINKS -->
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" active-class="nav-link--active"> Home </RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="nav-link--active">
          About
        </RouterLink>
        <RouterLink to="/products" class="nav-link" active-class="nav-link--active">
          Menu
        </RouterLink>
        <RouterLink to="/shop" class="nav-link" active-class="nav-link--active"> Shop </RouterLink>
        <RouterLink to="/orders" class="nav-link" active-class="nav-link--active">
          Orders
        </RouterLink>
        <RouterLink to="/contact" class="nav-link" active-class="nav-link--active">
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
      </div>
    </div>

    <!-- Mobile dropdown menu -->
    <transition name="fade-down">
      <nav v-if="isMobileMenuOpen" class="mobile-menu">
        <RouterLink to="/" class="mobile-link" @click="closeMobile">Home</RouterLink>
        <RouterLink to="/about" class="mobile-link" @click="closeMobile">About</RouterLink>
        <RouterLink to="/products" class="mobile-link" @click="closeMobile">Menu</RouterLink>
        <RouterLink to="/shop" class="mobile-link" @click="closeMobile">Shop</RouterLink>
        <RouterLink to="/orders" class="mobile-link" @click="closeMobile">Orders</RouterLink>
        <RouterLink to="/contact" class="mobile-link" @click="closeMobile">Contact</RouterLink>
        <RouterLink to="/cart" class="mobile-link" @click="closeMobile">Purchase</RouterLink>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
/* ---------- NAVBAR WRAPPER ---------- */
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

/* ---------- LEFT: LOGO ---------- */
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

/* ---------- CENTER: LINKS ---------- */
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

/* small hover emphasis for desktop */
.nav-link:hover {
  opacity: 1;
}

/* ---------- RIGHT: PURCHASE BUTTON + HAMBURGER ---------- */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* big yellow rectangle button */
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

/* hamburger */
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

/* turn into "X" when open */
.menu-btn--open .menu-bar:nth-child(1) {
  transform: translateY(3px) rotate(45deg);
}
.menu-btn--open .menu-bar:nth-child(2) {
  transform: translateY(-3px) rotate(-45deg);
}

/* ---------- MOBILE MENU ---------- */
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
</style>
