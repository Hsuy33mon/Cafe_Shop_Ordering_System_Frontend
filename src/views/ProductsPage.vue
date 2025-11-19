<template>
  <div class="page">
    <!-- soft floating background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <!-- MAIN CONTENT -->
    <main class="main">
      <section class="cs-container hero">
        <div class="hero-header cs-text-center">
          <span class="hero-pill">CafeShop · Starters</span>
          <h1 class="cs-heading-xl">Starters</h1>
          <p class="cs-body-muted hero-subtitle">
            Discover our curated cafe menu – fresh bowls, sushi plates and gourmet burgers to start
            your day.
          </p>
        </div>

        <!-- search + category -->
        <div class="filters">
          <div class="input-wrapper">
            <span class="input-icon">🔍</span>
            <input
              v-model="searchText"
              type="text"
              class="search-input"
              placeholder="Search menu…"
            />
          </div>

          <div class="input-wrapper select-wrapper">
            <span class="input-icon">☕</span>
            <select v-model="selectedCategory" class="category-select">
              <option value="">All categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <!-- category quick pills -->
        <div class="category-pills">
          <button
            type="button"
            class="pill"
            :class="{ 'pill--active': selectedCategory === '' }"
            @click="selectedCategory = ''"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="pill"
            :class="{ 'pill--active': selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </section>

      <!-- PRODUCTS GRID -->
      <section class="cs-container">
        <div class="products-grid">
          <article
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            class="product-card"
            :style="{ '--stagger': index }"
          >
            <div class="product-media" @click="goToDetails(product.id)">
              <img :src="product.imageUrl" :alt="product.name" class="product-image" />

              <div v-if="product.label" class="label-badge" :class="labelClass(product.label)">
                <span class="label-dot" />
                <span class="label-text">{{ product.label }}</span>
              </div>

              <div class="media-overlay">
                <span class="overlay-chip">Tap for details</span>
              </div>
            </div>

            <!-- name / description / rating / price -->
            <div class="product-bottom">
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">
                  {{ product.description }}
                </p>
                <div class="rating-row">
                  <div class="cs-stars">
                    <span
                      v-for="n in 5"
                      :key="n"
                      :class="{
                        star: true,
                        'cs-stars-muted': n > product.rating,
                      }"
                    >
                      ★
                    </span>
                  </div>
                  <span class="rating-count">
                    {{ product.rating.toFixed(1) }} · {{ product.ratingCount }} ratings
                  </span>
                </div>
              </div>

              <div class="price-tag">
                <span class="currency">฿</span>
                <span class="amount">{{ product.price }}</span>
              </div>
            </div>

            <!-- actions row -->
            <div class="card-actions">
              <button type="button" class="circle-btn" @click="showDetails(product)">⟳</button>

              <button
                type="button"
                class="add-cart-btn"
                :class="{ 'add-cart-btn--added': isInCart(product.id) }"
                @click="toggleCart(product)"
              >
                <span class="add-cart-label">
                  {{ isInCart(product.id) ? 'Added' : 'Add to cart' }}
                </span>
              </button>
            </div>
          </article>

          <p v-if="filteredProducts.length === 0" class="empty-state">
            No menu items found. Try another keyword or category.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function goToDetails(id: number) {
  router.push({ name: 'product-details', params: { id } })
}

function showDetails(product: Product) {
  goToDetails(product.id)
}

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  imageUrl: string
  label?: 'Vegan' | 'Hot' | 'New' | string
  rating: number
  ratingCount: number
}

const isMobileMenuOpen = ref(false)

// cart will store product ids
const cartIds = ref<number[]>([])

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Chevrefrit Bowl',
    category: 'Bowls',
    price: 14,
    description: 'Tomatoes, nori, feta cheese, mushrooms, rice noodles, corn, shrimp.',
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    label: 'Vegan',
    rating: 5,
    ratingCount: 4,
  },
  {
    id: 2,
    name: 'Saumon Gravlax',
    category: 'Sushi & Rolls',
    price: 9,
    description: 'Salmon, avocado, cucumber, sushi rice, house special sauces.',
    imageUrl: 'https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg',
    label: 'Vegan',
    rating: 4,
    ratingCount: 1,
  },
  {
    id: 3,
    name: 'Gourmet Burger',
    category: 'Burgers',
    price: 4,
    description: 'Beef patty, cheddar, lettuce, tomato, brioche bun, cafe sauce.',
    imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    label: 'Hot',
    rating: 4,
    ratingCount: 4,
  },
  {
    id: 4,
    name: 'Iced Caramel Latte',
    category: 'Coffee',
    price: 69,
    description: 'Espresso, caramel, cold milk, ice cubes.',
    imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    label: 'New',
    rating: 5,
    ratingCount: 10,
  },
  {
    id: 5,
    name: 'Matcha Latte',
    category: 'Tea',
    price: 5,
    description: 'Creamy matcha latte with soft milk foam.',
    imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    label: 'Vegan',
    rating: 5,
    ratingCount: 7,
  },
  {
    id: 6,
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 7,
    description: 'Rich dark chocolate layered cake with ganache.',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    rating: 4,
    ratingCount: 12,
  },
])

const searchText = ref('')
const selectedCategory = ref<string>('')

const categories = computed(() => Array.from(new Set(products.value.map((p) => p.category))))

const filteredProducts = computed(() => {
  const text = searchText.value.trim().toLowerCase()
  const cat = selectedCategory.value

  return products.value.filter((p) => {
    const byText =
      !text || p.name.toLowerCase().includes(text) || p.description.toLowerCase().includes(text)
    const byCategory = !cat || p.category === cat
    return byText && byCategory
  })
})

// bag count in navbar
const cartCount = computed(() => cartIds.value.length)

function closeMobile() {
  isMobileMenuOpen.value = false
}

function labelClass(label: string) {
  if (label.toLowerCase() === 'vegan') return 'label--vegan'
  if (label.toLowerCase() === 'hot') return 'label--hot'
  if (label.toLowerCase() === 'new') return 'label--new'
  return 'label--neutral'
}

function isInCart(id: number): boolean {
  return cartIds.value.includes(id)
}

function toggleCart(product: Product) {
  const index = cartIds.value.indexOf(product.id)
  if (index === -1) {
    cartIds.value.push(product.id)
  } else {
    cartIds.value.splice(index, 1)
  }
}
</script>

<style scoped>
.page {
  position: relative;
  background: radial-gradient(circle at top left, #fff7d6 0, #f9fafb 40%, #eef2ff 100%);
  min-height: 100vh;
  overflow: hidden;
}

/* floating blurred shapes */
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
  background: #fff7d6 0;
  top: -60px;
  right: 8%;
  animation: floatShape 18s ease-in-out infinite;
}

/* ---------- MAIN LAYOUT ---------- */
.main {
  padding-block: 2.8rem 3.2rem;
  position: relative;
  z-index: 1;
}

/* ---------- HERO + FILTERS ---------- */
.hero {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-bottom: 2.1rem;
}

.hero-header {
  position: relative;
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

.hero-subtitle {
  max-width: 520px;
  margin: 0.6rem auto 0;
  font-size: 0.95rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  justify-content: center;
}

.input-wrapper {
  position: relative;
  min-width: 240px;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.65;
}

.search-input,
.category-select {
  width: 100%;
  padding: 0.6rem 0.9rem 0.6rem 2.1rem;
  border-radius: 999px;
  border: 1px solid var(--cs-border-soft, #e5e7eb);
  background: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  outline: none;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.12s ease,
    background 0.16s ease;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus,
.category-select:focus {
  border-color: var(--cs-primary, #facc15);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.98);
}

.select-wrapper .category-select {
  -webkit-appearance: none;
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, #6b7280 50%),
    linear-gradient(135deg, #6b7280 50%, transparent 50%);
  background-position:
    calc(100% - 16px) 55%,
    calc(100% - 12px) 55%;
  background-size:
    4px 4px,
    4px 4px;
  background-repeat: no-repeat;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem;
}

.pill {
  border-radius: 999px;
  padding: 0.3rem 0.95rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.78rem;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;
  backdrop-filter: blur(10px);
}

.pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.pill--active {
  background: linear-gradient(135deg, #facc15, #f97316);
  border-color: transparent;
  color: #111827;
}

/* ---------- PRODUCT GRID ---------- */
.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.9rem;
}

/* 3 cards per row on tablet/desktop */
@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.product-card {
  position: relative;
  background: rgba(255, 255, 255, 0.96);
  border-radius: var(--cs-radius-lg, 22px);
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(248, 250, 252, 0.9);
  transform: translateY(20px);
  opacity: 0;
  animation: cardIn 0.65s ease-out forwards;
  animation-delay: calc(0.03s * var(--stagger));
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(250, 204, 21, 0.12), transparent 60%);
  opacity: 0;
  transition: opacity 0.18s ease;
  pointer-events: none;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 55px rgba(15, 23, 42, 0.16);
}

/* media */
.product-media {
  position: relative;
  padding-top: 78%;
  overflow: hidden;
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-out;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.55), transparent 55%);
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0.7rem 0.8rem;
  transition: opacity 0.18s ease-out;
}

.product-card:hover .media-overlay {
  opacity: 1;
}

.overlay-chip {
  font-size: 0.7rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.85);
  color: #f9fafb;
}

/* label badge */
.label-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.label-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background-color: currentColor;
}

.label-text {
  text-transform: capitalize;
}

/* label variants */
.label--vegan {
  background-color: #dcfce7;
  color: #166534;
}

.label--hot {
  background-color: #fee2e2;
  color: #b91c1c;
}

.label--new {
  background-color: #e0e7ff;
  color: #4338ca;
}

.label--neutral {
  background-color: #e5e7eb;
  color: #111827;
}

/* content */
.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.95rem 1rem 0.85rem;
  background: linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #fffbeb 100%);
}

.product-info {
  max-width: 75%;
}

.product-name {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.product-description {
  font-size: 0.8rem;
  color: var(--cs-text-muted, #6b7280);
  margin-bottom: 0.45rem;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  color: var(--cs-text-muted, #6b7280);
}

.star {
  font-size: 0.88rem;
}

.rating-count {
  font-size: 0.75rem;
}

.price-tag {
  display: flex;
  align-items: flex-end;
  background: linear-gradient(135deg, #facc15, #f97316);
  padding: 0.45rem 0.75rem;
  border-radius: 12px;
  min-width: 60px;
  justify-content: center;
  color: #111827;
  box-shadow: 0 12px 26px rgba(234, 179, 8, 0.8);
}

.currency {
  font-size: 0.75rem;
  margin-right: 0.1rem;
}

.amount {
  font-weight: 800;
  font-size: 1.05rem;
}

/* footer actions */
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem 1rem;
  background-color: #ffffff;
  border-radius: 0 0 var(--cs-radius-lg, 22px) 22px;
}

.circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--cs-border-soft, #e5e7eb);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.12s ease-out,
    transform 0.12s ease-out,
    box-shadow 0.12s ease-out;
}

.circle-btn:hover {
  background-color: #f9fafb;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.add-cart-btn {
  flex: 1;
  margin-left: 0.75rem;
  border-radius: 999px;
  border: none;
  padding: 0.6rem 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  background: linear-gradient(135deg, #facc15, #f97316);
  color: #111827;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(252, 211, 77, 0.7);
  transition:
    background 0.16s ease-out,
    box-shadow 0.16s ease-out,
    transform 0.12s ease-out;
}

.add-cart-btn:hover {
  box-shadow: 0 14px 34px rgba(252, 211, 77, 0.9);
  transform: translateY(-1px);
}

.add-cart-btn--added {
  background: #111827;
  color: #f9fafb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.6);
}

.add-cart-btn--added .add-cart-label::after {
  content: '✓';
  margin-left: 0.35rem;
  font-size: 0.8rem;
}

/* empty state */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--cs-text-muted, #6b7280);
  font-size: 0.9rem;
  padding-block: 1.5rem;
}

/* ---------- ANIMATIONS ---------- */
@keyframes floatShape {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(12px, -16px, 0);
  }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  .hero-subtitle {
    font-size: 0.9rem;
  }

  .products-grid {
    gap: 1.4rem;
  }

  .product-card {
    border-radius: 20px;
  }
}
</style>
