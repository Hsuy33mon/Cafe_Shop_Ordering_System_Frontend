<template>
  <div class="page">
    <!-- MAIN CONTENT -->
    <main class="main">
      <section class="cs-container hero">
        <div class="cs-text-center">
          <h1 class="cs-heading-xl">Starters</h1>
          <p class="cs-body-muted hero-subtitle">
            Discover our curated cafe menu – fresh bowls, sushi plates and gourmet burgers to start
            your day.
          </p>
        </div>

        <!-- search + category -->
        <div class="filters">
          <input v-model="searchText" type="text" class="search-input" placeholder="Search menu…" />

          <select v-model="selectedCategory" class="category-select">
            <option value="">All categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
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
          <article v-for="product in filteredProducts" :key="product.id" class="product-card">
            <div class="product-media">
              <img :src="product.imageUrl" :alt="product.name" class="product-image" />

              <div v-if="product.label" class="label-badge" :class="labelClass(product.label)">
                <span class="label-dot" />
                <span class="label-text">{{ product.label }}</span>
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
                  <span class="rating-count"> ({{ product.ratingCount }} ratings) </span>
                </div>
              </div>

              <div class="price-tag">
                <span class="currency">฿</span>
                <span class="amount">{{ product.price }}</span>
              </div>
            </div>

            <!-- NEW: actions row -->
            <div class="card-actions">
              <button type="button" class="circle-btn" @click="showDetails(product)">⟳</button>

              <button
                type="button"
                class="add-cart-btn"
                :class="{ 'add-cart-btn--added': isInCart(product.id) }"
                @click="toggleCart(product)"
              >
                <span class="add-cart-icon">🛍</span>
                <span>
                  {{ isInCart(product.id) ? 'Added' : 'Add to cart' }}
                </span>
              </button>
            </div>
          </article>

          <p v-if="filteredProducts.length === 0" class="empty-state">
            No menu items found. Adjust category or search keyword.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

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

function showDetails(product: Product) {
  // later you can open a modal or navigate
  alert(`Show details for: ${product.name}`)
}
</script>

<style scoped>
.page {
  background-color: var(--cs-bg);
  min-height: 100vh;
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

/* ---------- PRODUCT GRID ---------- */
.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}

/* 3 cards per row on tablet/desktop */
@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.product-card {
  background-color: #ffffff;
  border-radius: var(--cs-radius-lg);
  overflow: hidden;
  box-shadow: var(--cs-shadow-soft);
  display: flex;
  flex-direction: column;
}

.product-media {
  position: relative;
  padding-top: 80%;
  overflow: hidden;
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 180ms ease-out;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

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

/* label color variants */
.label--vegan {
  background-color: #dcfce7;
  color: #166534;
}

.label--hot {
  background-color: #fee2e2;
  color: #b91c1c;
}

.label--neutral {
  background-color: #e5e7eb;
  color: #111827;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.9rem 1rem 0.95rem;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #fff4d6 50%, #fffbeb 100%);
}

.product-info {
  max-width: 74%;
}

.product-name {
  font-size: 0.98rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.product-description {
  font-size: 0.8rem;
  color: var(--cs-text-muted);
  margin-bottom: 0.4rem;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--cs-text-muted);
}

.star {
  font-size: 0.9rem;
}

.rating-count {
  font-size: 0.75rem;
}

.price-tag {
  display: flex;
  align-items: flex-end;
  background-color: var(--cs-primary);
  padding: 0.45rem 0.7rem;
  border-radius: 10px 10px 0 10px;
  min-width: 56px;
  justify-content: center;
}

.currency {
  font-size: 0.75rem;
  margin-right: 0.1rem;
}

.amount {
  font-weight: 700;
  font-size: 1rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--cs-text-muted);
  font-size: 0.9rem;
  padding-block: 1.5rem;
}
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem 1rem;
  background-color: #ffffff;
  border-radius: 0 0 var(--cs-radius-lg) var(--cs-radius-lg);
}

.circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--cs-border-soft);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 120ms ease-out,
    transform 120ms ease-out,
    box-shadow 120ms ease-out;
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
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: var(--cs-primary);
  color: #111827;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(252, 211, 77, 0.55);
  transition:
    background-color 120ms ease-out,
    box-shadow 120ms ease-out,
    transform 120ms ease-out;
}

.add-cart-btn:hover {
  background-color: var(--cs-primary-dark);
  box-shadow: 0 12px 28px rgba(252, 211, 77, 0.75);
  transform: translateY(-1px);
}

.add-cart-btn--added {
  background-color: #111827;
  color: #f9fafb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.5);
}

.add-cart-icon {
  font-size: 1rem;
}
</style>
