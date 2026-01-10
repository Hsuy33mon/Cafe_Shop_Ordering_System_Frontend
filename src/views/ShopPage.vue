<template>
  <div class="shop-page">
    <!-- background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <main class="shop-main">
      <!-- HERO -->
      <section class="cs-container hero">
        <div class="hero-header">
          <span class="hero-pill">CafeShop Store</span>
          <h1 class="cs-heading-xl hero-title">Take a piece of CafeShop home.</h1>
          <p class="cs-body-muted hero-subtitle">
            Beans, bottles, gift cards and cozy merch inspired by our cafe – perfect for yourself or
            someone you like a latte.
          </p>
        </div>

        <!-- filters -->
        <div class="hero-filters">
          <div class="input-wrapper">
            <span class="input-icon">🔍</span>
            <input
              v-model="searchText"
              type="text"
              class="search-input"
              placeholder="Search shop items…"
            />
          </div>

          <div class="category-tabs">
            <button
              v-for="category in allCategories"
              :key="category.value"
              type="button"
              class="tab-btn"
              :class="{ 'tab-btn--active': selectedCategory === category.value }"
              @click="selectedCategory = category.value"
            >
              {{ category.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- PRODUCTS GRID -->
      <section class="cs-container">
        <div class="items-grid">
          <article
            v-for="(item, index) in paginatedItems"
            :key="item.id"
            class="item-card"
            :style="{ '--stagger': index }"
          >
            <div class="item-media" @click="goToDetails(item.id)">
              <img :src="item.imageUrl" :alt="item.name" class="item-image" />
              <div v-if="item.badge" class="item-badge">
                {{ item.badge }}
              </div>
            </div>

            <div class="item-content">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="item-rating" v-if="item.rating != null">
                <span class="stars">
                  <span
                    v-for="s in 5"
                    :key="s"
                    class="star"
                    :class="`star--${starType(item.rating ?? 0, s)}`"
                  >
                    ★
                  </span>
                </span>

                <span class="rating-number">{{ (item.rating ?? 0).toFixed(1) }}</span>
              </div>

              <p class="item-description">{{ item.description }}</p>

              <div class="item-meta">
                <span class="item-type">{{ item.category }}</span>
                <span class="item-size" v-if="item.size">{{ item.size }}</span>
              </div>

              <div class="item-footer">
                <div class="item-price">
                  <span class="currency">฿</span>
                  <span class="amount">{{ item.price }}</span>
                </div>

                <button
                  type="button"
                  class="item-btn"
                  :class="{ 'item-btn--added': isInCart(item.id) }"
                  @click="toggleCart(item)"
                >
                  <span>
                    {{ isInCart(item.id) ? 'Added' : 'Add to bag' }}
                  </span>
                </button>
              </div>
            </div>
          </article>

          <p v-if="filteredItems.length === 0" class="empty-state">
            No items found. Try another keyword or filter.
          </p>
        </div>
        <!-- PAGINATION -->
        <div v-if="totalItems > 0" class="pagination">
          <button type="button" class="page-btn" :disabled="currentPage === 1" @click="prevPage">
            Prev
          </button>

          <div class="page-info">
            Page <strong>{{ currentPage }}</strong> / {{ totalPages }}
            <span class="page-total">· {{ showingCount }} of {{ totalItems }} items</span>
          </div>

          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </section>

      <!-- STICKY CART SUMMARY -->
      <transition name="fade-up">
        <div v-if="cartCount > 0" class="cart-summary">
          <div class="cart-summary-info">
            <span class="cart-summary-count"
              >{{ cartCount }} item{{ cartCount > 1 ? 's' : '' }}</span
            >
            <span class="cart-summary-text">in your bag</span>
          </div>
          <button type="button" class="cart-summary-btn" @click="goToCart">View bag</button>
        </div>
      </transition>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

type ShopItem = {
  id: number
  name: string
  category: 'Coffee beans' | 'Bottles & cups' | 'Merch' | 'Gift cards' | string
  price: number
  description: string
  size?: string
  badge?: string
  imageUrl: string
  rating?: number // ✅ add this
}

const router = useRouter()

function goToDetails(id: number) {
  router.push({ name: 'product-details', params: { id } })
}

const items = ref<ShopItem[]>([
  {
    id: 1,
    name: 'House Blend Beans',
    category: 'Coffee beans',
    price: 320,
    rating: 4.7,
    description: 'Balanced chocolate & nut profile – perfect for everyday pour-over.',
    size: '250 g · Whole beans',
    badge: 'Best seller',
    imageUrl: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg',
  },
  {
    id: 2,
    name: 'Weekend Espresso Roast',
    category: 'Coffee beans',
    price: 350,
    rating: 4.3,
    description: 'Rich, syrupy espresso roast with notes of caramel and dark chocolate.',
    size: '250 g · Whole beans',
    badge: 'New',
    imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
  },
  {
    id: 3,
    name: 'House Blend Beans',
    category: 'Coffee beans',
    price: 320,
    rating: 4.7,
    description: 'Balanced chocolate & nut profile – perfect for everyday pour-over.',
    size: '250 g · Whole beans',
    badge: 'Best seller',
    imageUrl: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg',
  },
  {
    id: 4,
    name: 'Weekend Espresso Roast',
    category: 'Coffee beans',
    price: 350,
    rating: 4.3,
    description: 'Rich, syrupy espresso roast with notes of caramel and dark chocolate.',
    size: '250 g · Whole beans',
    badge: 'New',
    imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
  },
  {
    id: 5,
    name: 'House Blend Beans',
    category: 'Coffee beans',
    price: 320,
    rating: 4.7,
    description: 'Balanced chocolate & nut profile – perfect for everyday pour-over.',
    size: '250 g · Whole beans',
    badge: 'Best seller',
    imageUrl: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg',
  },
  {
    id: 6,
    name: 'Weekend Espresso Roast',
    category: 'Coffee beans',
    price: 350,
    rating: 4.3,
    description: 'Rich, syrupy espresso roast with notes of caramel and dark chocolate.',
    size: '250 g · Whole beans',
    badge: 'New',
    imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
  },
  {
    id: 7,
    name: 'CafeShop Tumbler',
    category: 'Bottles & cups',
    price: 280,
    rating: 4.3,
    description: 'Insulated stainless-steel tumbler to keep your latte warm on the go.',
    size: '400 ml · Double wall',
    imageUrl: 'https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg',
  },
  {
    id: 8,
    name: 'Ceramic Mug Set',
    category: 'Bottles & cups',
    price: 420,
    rating: 4.3,
    description: 'Two matte ceramic mugs in our cafe color palette.',
    size: '2 x 320 ml',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
  },
  {
    id: 9,
    name: 'CafeShop Tote Bag',
    category: 'Merch',
    price: 190,
    rating: 4.3,
    description: 'Lightweight cotton tote with a subtle CafeShop illustration.',
    size: 'One size',
    badge: 'Limited',
    imageUrl: 'https://images.pexels.com/photos/3738614/pexels-photo-3738614.jpeg',
  },
  {
    id: 10,
    name: 'Gift Card – Brunch for Two',
    category: 'Gift cards',
    price: 600,
    rating: 4.3,
    description: 'Includes two mains, two drinks and a shared dessert.',
    size: 'Digital · Single use',
    imageUrl: 'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg',
  },
  {
    id: 11,
    name: 'Ceramic Mug Set',
    category: 'Bottles & cups',
    price: 420,
    rating: 4.3,
    description: 'Two matte ceramic mugs in our cafe color palette.',
    size: '2 x 320 ml',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
  },
  {
    id: 12,
    name: 'CafeShop Tote Bag',
    category: 'Merch',
    price: 190,
    rating: 4.3,
    description: 'Lightweight cotton tote with a subtle CafeShop illustration.',
    size: 'One size',
    badge: 'Limited',
    imageUrl: 'https://images.pexels.com/photos/3738614/pexels-photo-3738614.jpeg',
  },
  {
    id: 13,
    name: 'Gift Card – Brunch for Two',
    category: 'Gift cards',
    price: 600,
    rating: 4.3,
    description: 'Includes two mains, two drinks and a shared dessert.',
    size: 'Digital · Single use',
    imageUrl: 'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg',
  },
  {
    id: 14,
    name: 'Ceramic Mug Set',
    category: 'Bottles & cups',
    price: 420,
    rating: 4.3,
    description: 'Two matte ceramic mugs in our cafe color palette.',
    size: '2 x 320 ml',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
  },
  {
    id: 15,
    name: 'CafeShop Tote Bag',
    category: 'Merch',
    price: 190,
    rating: 4.3,
    description: 'Lightweight cotton tote with a subtle CafeShop illustration.',
    size: 'One size',
    badge: 'Limited',
    imageUrl: 'https://images.pexels.com/photos/3738614/pexels-photo-3738614.jpeg',
  },
  {
    id: 16,
    name: 'Gift Card – Brunch for Two',
    category: 'Gift cards',
    price: 600,
    rating: 4.3,
    description: 'Includes two mains, two drinks and a shared dessert.',
    size: 'Digital · Single use',
    imageUrl: 'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg',
  },
])
const currentPage = ref(1)
const pageSize = ref(12)
const searchText = ref('')
const selectedCategory = ref<string>('all')
const cartIds = ref<number[]>([])

const allCategories = [
  { value: 'all', label: 'All items' },
  { value: 'Coffee beans', label: 'Coffee beans' },
  { value: 'Bottles & cups', label: 'Bottles & cups' },
  { value: 'Merch', label: 'Merch' },
  { value: 'Gift cards', label: 'Gift cards' },
]

const showingCount = computed(() => paginatedItems.value.length)

const filteredItems = computed(() => {
  const text = searchText.value.trim().toLowerCase()
  const cat = selectedCategory.value

  return items.value.filter((item) => {
    const byCategory = cat === 'all' || item.category === cat
    const byText =
      !text ||
      item.name.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text)
    return byCategory && byText
  })
})

// keep your filteredItems as-is, but reset to page 1 when filters change
const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

function goToPage(page: number) {
  const safe = Math.min(Math.max(1, page), totalPages.value)
  currentPage.value = safe
}

function nextPage() {
  goToPage(currentPage.value + 1)
}

function prevPage() {
  goToPage(currentPage.value - 1)
}

watch([searchText, selectedCategory], () => {
  currentPage.value = 1
})

const cartCount = computed(() => cartIds.value.length)

function isInCart(id: number): boolean {
  return cartIds.value.includes(id)
}

function toggleCart(item: ShopItem) {
  const index = cartIds.value.indexOf(item.id)
  if (index === -1) {
    cartIds.value.push(item.id)
  } else {
    cartIds.value.splice(index, 1)
  }
}

function goToCart() {
  router.push('/cart')
}
function clampRating(r?: number) {
  return Math.min(5, Math.max(0, r ?? 0))
}

function starType(rating: number, starNumber: number): 'full' | 'half' | 'empty' {
  const r = clampRating(rating)

  if (r >= starNumber) return 'full'
  if (r >= starNumber - 0.5) return 'half'
  return 'empty'
}
</script>

<style scoped src="@/styles/customer/shop-item.css"></style>
