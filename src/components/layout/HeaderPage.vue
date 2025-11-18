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
      <div class="navbar-left">
        <div class="logo">
          <div class="logo-icon">☕</div>
          <div class="logo-text">CafeShop</div>
        </div>

        <!-- Desktop nav links -->
        <nav class="nav-links">
          <RouterLink
            to="/"
            class="nav-link"
            active-class="nav-link--active"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="nav-link"
            active-class="nav-link--active"
          >
            About
          </RouterLink>
          <RouterLink
            to="/products"
            class="nav-link"
            active-class="nav-link--active"
          >
            Products
          </RouterLink>
          <RouterLink
            to="/contact"
            class="nav-link"
            active-class="nav-link--active"
          >
            Contact
          </RouterLink>
        </nav>
      </div>

      <div class="navbar-right">
        <!-- Shopping bag -->
        <button type="button" class="bag-btn" @click="goToCart">
          <span class="bag-icon">🛍</span>
          <span class="bag-label">Bag</span>
          <span v-if="cartCount > 0" class="bag-count">{{ cartCount }}</span>
        </button>

        <!-- Mobile hamburger -->
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
        <RouterLink to="/products" class="mobile-link" @click="closeMobile">Products</RouterLink>
        <RouterLink to="/contact" class="mobile-link" @click="closeMobile">Contact</RouterLink>
        <RouterLink to="/cart" class="mobile-link" @click="closeMobile">Shopping Bag</RouterLink>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.page {
  background-color: var(--cs-bg);
  min-height: 100vh;
}

/* ---------- NAVBAR ---------- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(16px);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.92),
    rgba(255, 255, 255, 0.85)
  );
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 0.7rem;
}

/* LEFT SIDE */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 2.4rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  background: radial-gradient(circle at 20% 0, #fef3c7, #facc15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 10px 22px rgba(234, 179, 8, 0.7);
}

.logo-text {
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.04em;
}

/* NAV LINKS */
.nav-links {
  display: flex;
  gap: 1.4rem;
  font-size: 0.94rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--cs-text-muted);
  padding: 0.25rem 0;
  transition:
    color 0.16s ease,
    transform 0.12s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -0.35rem;
  width: 0;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(135deg, #facc15, #f97316);
  transform: translateX(-50%);
  transition: width 0.18s ease;
}

.nav-link:hover {
  color: var(--cs-text-main);
  transform: translateY(-1px);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link--active {
  color: var(--cs-text-main);
  font-weight: 600;
}

.nav-link--active::after {
  width: 100%;
}

/* RIGHT SIDE */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

/* Bag button */
.bag-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: radial-gradient(circle at 0 0, #fefce8, #ffffff);
  cursor: pointer;
  font-size: 0.86rem;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.12);
  transition:
    transform 0.12s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.bag-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.18);
  border-color: rgba(234, 179, 8, 0.7);
  background: radial-gradient(circle at 0 0, #fef3c7, #ffffff);
}

.bag-icon {
  font-size: 1rem;
}

.bag-label {
  font-size: 0.85rem;
}

.bag-count {
  min-width: 1.3rem;
  height: 1.3rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #f97316, #ef4444);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #f9fafb;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.65);
}

/* Hamburger */
.menu-btn {
  display: none;
  border: none;
  background: transparent;
  padding: 0.3rem;
  flex-direction: column;
  gap: 0.22rem;
  cursor: pointer;
  border-radius: 999px;
  transition:
    background-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.12s ease;
}

.menu-btn:hover {
  background-color: rgba(15, 23, 42, 0.03);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

.menu-bar {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background-color: var(--cs-text-main);
  transition:
    transform 0.18s ease,
    opacity 0.18s ease,
    width 0.18s ease;
}

/* hamburger animation when open */
.menu-btn--open .menu-bar:nth-child(1) {
  transform: translateY(3px) rotate(45deg);
  width: 18px;
}

.menu-btn--open .menu-bar:nth-child(2) {
  transform: translateY(-3px) rotate(-45deg);
  width: 18px;
}

/* mobile menu */
.mobile-menu {
  display: none;
}

/* ---------- MOBILE BEHAVIOUR ---------- */
@media (max-width: 767px) {
  .nav-links {
    display: none;
  }

  .menu-btn {
    display: inline-flex;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 0.98);
    border-top: 1px solid rgba(148, 163, 184, 0.3);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(12px);
  }

  .mobile-link {
    padding: 0.9rem 1.5rem;
    text-decoration: none;
    font-size: 0.95rem;
    color: var(--cs-text-main);
    border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  }

  .mobile-link:last-child {
    border-bottom: none;
  }
}

/* ---------- TRANSITIONS (for <transition name="fade-down">) ---------- */
.fade-down-enter-active,
.fade-down-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
