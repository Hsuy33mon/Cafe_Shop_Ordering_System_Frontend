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
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/about" class="nav-link">About</RouterLink>
          <RouterLink to="/products" class="nav-link active">Products</RouterLink>
          <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
        </nav>
      </div>

      <div class="navbar-right">
        <!-- Shopping bag -->
        <div class="navbar-right">
          <button type="button" class="bag-btn" @click="goToCart">
            <span class="bag-icon">🛍</span>
            <span class="bag-label">Bag</span>
            <span v-if="cartCount > 0" class="bag-count">{{ cartCount }}</span>
          </button>
        </div>

        <!-- Mobile hamburger -->
        <button type="button" class="menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span class="menu-bar" />
          <span class="menu-bar" />
        </button>
      </div>
    </div>

    <!-- Mobile dropdown menu -->
    <transition name="fade-down">
      <nav v-if="isMobileMenuOpen" class="mobile-menu">
        <RouterLink to="/" class="mobile-link" @click="closeMobile"> Home </RouterLink>
        <RouterLink to="/about" class="mobile-link" @click="closeMobile"> About </RouterLink>
        <RouterLink to="/products" class="mobile-link" @click="closeMobile"> Products </RouterLink>
        <RouterLink to="/contact" class="mobile-link" @click="closeMobile">Contact</RouterLink>
        <RouterLink to="/cart" class="mobile-link" @click="closeMobile"> Shopping Bag </RouterLink>
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
  z-index: 20;
  background-color: #ffffff;
  border-bottom: 1px solid var(--cs-border-soft);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 0.9rem;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background-color: var(--cs-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
}

.nav-links {
  display: flex;
  gap: 1.6rem;
  font-size: 0.95rem;
}

.nav-link {
  text-decoration: none;
  color: var(--cs-text-muted);
  position: relative;
  padding-block: 0.15rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.25rem;
  width: 0;
  height: 2px;
  border-radius: 999px;
  background-color: var(--cs-primary);
  transition: width 160ms ease-out;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active {
  color: var(--cs-text-main);
}

.nav-link.active::after {
  width: 100%;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bag-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--cs-surface-alt);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--cs-border-soft);
  cursor: pointer;
}

.bag-label {
  font-size: 0.85rem;
}

.bag-count {
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background-color: var(--cs-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
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
  background-color: var(--cs-text-main);
}

/* mobile menu */
.mobile-menu {
  display: none;
}

/* ---------- HERO + FILTERS ---------- */
.main {
  padding-block: 2.5rem 3rem;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-bottom: 2rem;
}

.hero-subtitle {
  max-width: 480px;
  margin: 0.5rem auto 0;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  justify-content: center;
}

.search-input,
.category-select {
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--cs-border-soft);
  background-color: #ffffff;
  font-size: 0.9rem;
  min-width: 220px;
  outline: none;
}

.search-input:focus,
.category-select:focus {
  border-color: var(--cs-primary);
}

.category-select {
  max-width: 210px;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.pill {
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--cs-border-soft);
  background-color: #ffffff;
  font-size: 0.8rem;
  cursor: pointer;
}

.pill--active {
  background-color: var(--cs-primary);
  border-color: var(--cs-primary);
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
    background-color: #ffffff;
    border-top: 1px solid var(--cs-border-soft);
  }

  .mobile-link {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    font-size: 0.9rem;
    color: var(--cs-text-main);
    border-bottom: 1px solid var(--cs-border-soft);
  }

  .mobile-link:last-child {
    border-bottom: none;
  }

  .hero {
    margin-top: 0.75rem;
  }
}
</style>
