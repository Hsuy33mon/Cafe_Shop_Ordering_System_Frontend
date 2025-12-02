<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="cs-container hero-inner">
        <div class="hero-left">
          <p class="eyebrow">Welcome to CafeShop</p>
          <h1 class="hero-title">Feel-good food <span class="highlight">for every mood</span></h1>
          <p class="hero-text">
            Bowls, burgers, sushi and coffee – crafted fresh for food lovers. Eat in, grab &amp; go
            or enjoy from your room.
          </p>

          <div class="hero-actions">
            <button type="button" class="btn primary" @click="goToProducts">View menu</button>
            <button type="button" class="btn ghost" @click="goToCart">Order now</button>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">25+</span>
              <span class="stat-label">Signature dishes</span>
            </div>
            <div class="stat">
              <span class="stat-number">4.8★</span>
              <span class="stat-label">Guest rating</span>
            </div>
            <div class="stat">
              <span class="stat-number">5 min</span>
              <span class="stat-label">Avg. prep time</span>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <div class="hero-plate">
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
              alt="Colorful salad bowl"
            />
          </div>
          <div class="floating-card floating-card--top">
            <span class="dot dot--green" />
            <div>
              <p class="floating-label">Best seller</p>
              <p class="floating-text">Chevrefrit Bowl</p>
            </div>
          </div>
          <div class="floating-card floating-card--bottom">
            <p class="floating-text">Fresh, fast &amp; made with love 💛</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section categories">
      <div class="cs-container">
        <header class="section-header">
          <p class="eyebrow">Explore</p>
          <h2 class="section-title">For every kind of craving</h2>
          <p class="section-subtitle">
            Light bowls, juicy burgers, cozy coffee or sweet desserts – pick your favourite mood.
          </p>
        </header>

        <div class="category-grid">
          <article v-for="cat in featuredCategories" :key="cat.id" class="category-card">
            <div class="category-icon">{{ cat.icon }}</div>
            <h3 class="category-name">{{ cat.name }}</h3>
            <p class="category-desc">{{ cat.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- SPECIALS / HIGHLIGHTED ITEMS -->
    <section class="section specials" id="menu">
      <div class="cs-container">
        <header class="section-header specials-header">
          <div>
            <p class="eyebrow">Today’s picks</p>
            <h2 class="section-title">Made for food lovers</h2>
            <p class="section-subtitle">A few favourites our guests can’t stop talking about.</p>
          </div>
          <button type="button" class="btn subtle" @click="goToProducts">See full menu →</button>
        </header>

        <div class="specials-grid">
          <article v-for="item in specials" :key="item.id" class="special-card">
            <div class="special-media" @click="goToDetails(item.id)">
              <img :src="item.imageUrl" :alt="item.name" />
              <span v-if="item.badge" class="badge">
                {{ item.badge }}
              </span>
            </div>

            <div class="special-body">
              <div class="special-top">
                <h3 class="special-name">{{ item.name }}</h3>
                <span class="special-price">฿{{ item.price }}</span>
              </div>
              <p class="special-desc">{{ item.description }}</p>
              <div class="special-meta">
                <span class="meta-chip">
                  ★ {{ item.rating.toFixed(1) }} ({{ item.ratingCount }})
                </span>
                <span class="meta-chip">{{ item.category }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- STORY / CTA -->
    <section class="section story">
      <div class="cs-container story-inner">
        <div class="story-text">
          <p class="eyebrow">Why guests love us</p>
          <h2 class="section-title">Warm vibes, bold flavors</h2>
          <p class="section-subtitle">
            We mix hotel-style comfort with cafe soul. From early-morning coffee to late-night
            snacks, our team cooks each plate like it’s for a friend.
          </p>
          <ul class="story-list">
            <li>Fresh ingredients prepared throughout the day</li>
            <li>Room delivery for cozy nights in</li>
            <li>Friendly baristas &amp; chefs who love food</li>
          </ul>
        </div>
        <div class="story-card">
          <p class="quote-text">
            “The burger was insane and the matcha latte is my new obsession. I ordered three nights
            in a row.”
          </p>
          <p class="quote-author">— Mai, food lover & guest</p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA STRIP -->
    <section class="section cta-strip">
      <div class="cs-container cta-inner">
        <div>
          <h2 class="cta-title">Ready for your next favorite bite?</h2>
          <p class="cta-subtitle">
            Browse the menu, tap to order and we’ll handle the delicious part.
          </p>
        </div>
        <div class="cta-actions">
          <button type="button" class="btn primary" @click="goToProducts">Browse menu</button>
          <button type="button" class="btn ghost" @click="goToCart">View cart</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDetails(id: number) {
  router.push({ name: 'product-details', params: { id } })
}

const featuredCategories = ref([
  {
    id: 1,
    name: 'Fresh Bowls',
    icon: '🥗',
    description: 'Colorful, crunchy and packed with veggies & grains.',
  },
  {
    id: 2,
    name: 'Burgers & Buns',
    icon: '🍔',
    description: 'Juicy patties, toasted brioche and melty cheese.',
  },
  {
    id: 3,
    name: 'Coffee & Sips',
    icon: '☕',
    description: 'From espresso shots to sweet iced lattes.',
  },
  {
    id: 4,
    name: 'Sweet Things',
    icon: '🍰',
    description: 'End on a high note with cakes and desserts.',
  },
])

const specials = ref([
  {
    id: 1,
    name: 'Chevrefrit Bowl',
    category: 'Bowls',
    price: 189,
    description: 'Tomatoes, feta, mushrooms, corn and crisp greens.',
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    badge: 'Guest favourite',
    rating: 4.9,
    ratingCount: 42,
  },
  {
    id: 2,
    name: 'Saumon Gravlax',
    category: 'Sushi & Rolls',
    price: 159,
    description: 'Salmon, avocado, cucumber, sushi rice & house sauce.',
    imageUrl: 'https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg',
    badge: 'Chef’s pick',
    rating: 4.8,
    ratingCount: 28,
  },
  {
    id: 3,
    name: 'Gourmet Burger',
    category: 'Burgers',
    price: 139,
    description: 'Beef patty, cheddar, lettuce, tomato, brioche bun.',
    imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    badge: 'Most ordered',
    rating: 4.7,
    ratingCount: 55,
  },
])

function goToProducts() {
  router.push('/products')
}

function goToCart() {
  router.push('/cart')
}
</script>

<style scoped>
.home {
  background-color: var(--cs-bg);
}

/* ---------- HERO ---------- */
.hero {
  padding-block: 2.8rem 2.5rem;
}

.hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.2fr);
  gap: 2.5rem;
  align-items: center;
}

.hero-left {
  animation: fadeUp 700ms ease-out;
}

.eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cs-text-muted);
  margin-bottom: 0.4rem;
}

.hero-title {
  font-size: clamp(2.1rem, 3vw, 2.7rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 0.6rem;
  color: #111827;
}

.highlight {
  color: var(--cs-primary-dark, #f59e0b);
}

.hero-text {
  font-size: 0.95rem;
  color: var(--cs-text-muted);
  max-width: 480px;
  margin-bottom: 1.2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.4rem;
}

/* buttons */
.btn {
  border-radius: 999px;
  padding: 0.65rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.btn.primary {
  background-color: var(--cs-primary);
  color: #111827;
  box-shadow: 0 12px 28px rgba(252, 211, 77, 0.7);
}

.btn.ghost {
  background-color: #ffffff;
  color: #111827;
  border: 1px solid var(--cs-border-soft);
}

.btn.subtle {
  background-color: transparent;
  color: var(--cs-text-main);
  border-radius: 999px;
  padding-inline: 0;
  font-weight: 500;
}

/* hero stats */
.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  font-size: 0.8rem;
}

.stat-number {
  display: block;
  font-weight: 700;
  font-size: 1.05rem;
}

.stat-label {
  color: var(--cs-text-muted);
}

/* hero right */
.hero-right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatIn 800ms ease-out;
}

.hero-plate {
  width: min(360px, 90%);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
  animation: plateFloat 5s ease-in-out infinite alternate;
}

.hero-plate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.floating-card {
  position: absolute;
  border-radius: 999px;
  background-color: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.25);
  padding: 0.45rem 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.floating-card--top {
  top: 10%;
  left: -4%;
}

.floating-card--bottom {
  bottom: 8%;
  right: -5%;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.dot--green {
  background-color: #16a34a;
}

.floating-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--cs-text-muted);
}

.floating-text {
  font-weight: 600;
}

/* ---------- GENERIC SECTION ---------- */
.section {
  padding-block: 2.2rem 2.4rem;
}

.section-header {
  text-align: center;
  margin-bottom: 1.8rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.section-subtitle {
  font-size: 0.9rem;
  color: var(--cs-text-muted);
  max-width: 480px;
  margin: 0 auto;
}

/* ---------- CATEGORIES ---------- */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.4rem;
}

.category-card {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 1.1rem 1rem;
  box-shadow: var(--cs-shadow-soft);
  text-align: left;
  transform: translateY(0);
  transition:
    transform 160ms ease-out,
    box-shadow 160ms ease-out;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: #fff7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.6rem;
  font-size: 1.3rem;
}

.category-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.category-desc {
  font-size: 0.82rem;
  color: var(--cs-text-muted);
}

/* ---------- SPECIALS ---------- */
.specials-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
}

.specials-grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.special-card {
  background-color: #ffffff;
  border-radius: var(--cs-radius-lg);
  overflow: hidden;
  box-shadow: var(--cs-shadow-soft);
  display: flex;
  flex-direction: column;
  animation: fadeUp 700ms ease-out;
}

.special-media {
  position: relative;
  padding-top: 70%;
  overflow: hidden;
}

.special-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 180ms ease-out;
}

.special-card:hover .special-media img {
  transform: scale(1.04);
}

.badge {
  position: absolute;
  left: 0.9rem;
  top: 0.9rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  background-color: #fef3c7;
}

.special-body {
  padding: 0.85rem 1rem 1rem;
}

.special-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.3rem;
}

.special-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.special-price {
  font-size: 0.9rem;
  font-weight: 700;
}

.special-desc {
  font-size: 0.8rem;
  color: var(--cs-text-muted);
  margin-bottom: 0.55rem;
}

.special-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.meta-chip {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background-color: #f9fafb;
}

/* ---------- STORY ---------- */
.story-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
}

.story-list {
  margin-top: 0.7rem;
  font-size: 0.86rem;
  padding-left: 1.1rem;
  color: var(--cs-text-main);
}

.story-list li + li {
  margin-top: 0.25rem;
}

.story-card {
  background: linear-gradient(135deg, #111827, #1f2937);
  color: #f9fafb;
  border-radius: 20px;
  padding: 1.3rem 1.4rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.6);
}

.quote-text {
  font-size: 0.9rem;
  margin-bottom: 0.7rem;
}

.quote-author {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* ---------- CTA STRIP ---------- */
.cta-strip {
  padding-block: 2rem 3rem;
}

.cta-inner {
  background-color: #111827;
  border-radius: 24px;
  padding: 1.7rem 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  color: #f9fafb;
}

.cta-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.cta-subtitle {
  font-size: 0.85rem;
  opacity: 0.85;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

/* ---------- ANIMATIONS ---------- */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes plateFloat {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 960px) {
  .hero-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-right {
    order: -1;
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .specials-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .story-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .story-card {
    margin-top: 1rem;
  }
}

@media (max-width: 640px) {
  .specials-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .category-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .cta-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
