<template>
  <div class="page">
    <!-- soft floating background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <!-- MAIN CONTENT -->
    <main class="main">
      <section class="cs-container hero">
        <div class="hero-header cs-text-center">
          <span class="hero-pill">Five Two One Cafe & Bakery · Starters</span>
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

<style scoped src="@/styles/customer/product-page.css"></style>
