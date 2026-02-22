<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrderSessionStore } from '@/stores/orderSession'
import { useCartStore } from '../../stores/useCartStore'

const router = useRouter()
const route = useRoute()

const goToCart = () => router.push('/cart')

const session = useOrderSessionStore()
session.hydrate()

const sessionLabel = computed(() => {
  if (!session.isReady) return ''

  const typeLabel = session.orderType === 'ROOM' ? 'Room' : 'Table'
  const no = (session.placeNumber || session.tableNumber || '').trim()

  return `${session.customerName} • ${typeLabel} ${no}`
})

const isMobileMenuOpen = ref(false)
const cartStore = useCartStore()
const cartCount = computed(() => {
  return cartStore.items.length
})

function closeMobile() {
  isMobileMenuOpen.value = false
}

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
        <!-- <div class="logo-icon">☕</div> -->
         <!-- <div class="logo-icon">
  <img src="@/assets/logo.jpeg" alt="CafeShop Logo" class="logo-img" />
</div> -->
        <div class="logo-text">Five Two One Cafe & Bakery</div>
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

        <RouterLink to="/shop" class="nav-link" :class="{ 'nav-link--active': isActive('/shop') }">
          Menu
        </RouterLink>

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
          to="/shop"
          class="mobile-link"
          :class="{ 'mobile-link--active': isActive('/shop') }"
          @click="closeMobile"
          >Menu</RouterLink
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

<style scoped src="@/styles/customer/header-page.css"></style>
