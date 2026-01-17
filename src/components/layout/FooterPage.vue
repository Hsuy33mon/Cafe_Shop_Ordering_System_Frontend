<template>
  <footer class="footer">
    <div class="cs-container footer-inner">
      <!-- Brand / intro -->
      <div class="footer-col footer-brand">
        <div class="footer-logo">
          <div class="logo-icon">☕</div>
          <div class="logo-text">CafeShop</div>
        </div>
        <p class="footer-text">
          Feel-good food, cozy coffee and late-night snacks – made for food lovers staying in or
          hanging out.
        </p>

        <div class="footer-badges">
          <span class="badge">Fresh daily</span>
          <span class="badge">Room delivery</span>
        </div>
      </div>

      <!-- Navigation -->
      <div class="footer-col">
        <h3 class="footer-title">Explore</h3>
        <nav class="footer-links">
          <RouterLink to="/" class="footer-link">Home</RouterLink>
          <RouterLink to="/about" class="footer-link">About</RouterLink>
          <RouterLink to="/products" class="footer-link">Menu</RouterLink>
          <RouterLink to="/cart" class="footer-link">Your Cart</RouterLink>
          <RouterLink to="/contact" class="footer-link">Contact</RouterLink>
        </nav>
      </div>

      <!-- Contact + hours -->
      <div class="footer-col">
        <h3 class="footer-title">Visit &amp; hours</h3>
        <p class="footer-text">
          Ground floor, hotel lobby<br />
          (Cafe corner)
        </p>
        <p class="footer-text">Daily: <strong>7:00 – 22:00</strong></p>

        <div class="footer-contact">
          <p class="footer-text">
            Phone: <a href="tel:+66000000000" class="footer-link-inline">+66 00 000 0000</a>
          </p>
          <p class="footer-text">Line / Chat: <span class="footer-link-inline">@cafeshop</span></p>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="cs-container footer-bottom-inner">
        <p class="footer-copy">© {{ new Date().getFullYear() }} CafeShop. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="#" class="footer-bottom-link">Privacy</a>
          <a href="#" class="footer-bottom-link">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped src="@/styles/customer/footer-page.css"></style>
