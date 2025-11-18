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

<style scoped>
.footer {
  margin-top: 2rem;
  background: #0f172a;
  color: #e5e7eb;
  padding-top: 2.4rem;
}

/* main area */
.footer-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 2rem;
  padding-bottom: 1.8rem;
}

.footer-col {
  font-size: 0.85rem;
}

.footer-brand {
  max-width: 340px;
}

/* logo */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
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

/* text */
.footer-text {
  font-size: 0.82rem;
  color: #9ca3af;
  line-height: 1.5;
  margin-bottom: 0.4rem;
}

.footer-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.3rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background-color: rgba(248, 250, 252, 0.08);
  border: 1px solid rgba(248, 250, 252, 0.14);
}

/* column titles */
.footer-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
}

/* nav links */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-link {
  text-decoration: none;
  font-size: 0.82rem;
  color: #e5e7eb;
  opacity: 0.78;
  transition:
    opacity 120ms ease-out,
    transform 120ms ease-out;
}

.footer-link:hover {
  opacity: 1;
  transform: translateX(1px);
}

.footer-link-inline {
  color: #e5e7eb;
  text-decoration: none;
  border-bottom: 1px dashed rgba(248, 250, 252, 0.3);
}

/* contact */
.footer-contact {
  margin-top: 0.4rem;
}

/* bottom bar */
.footer-bottom {
  border-top: 1px solid rgba(15, 23, 42, 0.9);
  margin-top: 0.4rem;
  background-color: #020617;
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 0.8rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.footer-bottom-links {
  display: flex;
  gap: 0.8rem;
}

.footer-bottom-link {
  color: inherit;
  text-decoration: none;
}

.footer-copy {
  margin: 0;
}

/* responsive */
@media (max-width: 960px) {
  .footer-inner {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .footer-bottom-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}
</style>
