<template>
  <div class="shop-page">
    <!-- background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <main class="shop-main">
      <!-- HERO -->
      <section class="cs-container hero">
        <div class="hero-header">
          <span class="hero-pill">Five Two One Cafe & Bakery</span>
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
            <input v-model="searchText" type="text" class="search-input" placeholder="Search shop items…" />
          </div>

          <div class="category-tabs">
            <button v-for="category in allCategories" :key="category.value" type="button" class="tab-btn"
              :class="{ 'tab-btn--active': selectedCategory === category.value }"
              @click="selectedCategory = category.value">
              {{ category.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- PRODUCTS GRID -->
      <section class="cs-container">
        <div class="items-grid">
          <article v-for="(item, index) in paginatedItems" :key="item.id" class="item-card"
            :style="{ '--stagger': index }">
            <div class="item-media" :class="{ 'item-media--disabled': item.status === 'OUT_OF_STOCK' }"
              @click="item.status !== 'OUT_OF_STOCK' && goToDetails(item.id)">
              <img :src="item.imageUrl || '/images/default.png'" :alt="item.name" class="item-image" />

              <!-- TAG BADGE (Season, Winter, etc.) -->
              <div v-if="item.badge && item.status !== 'OUT_OF_STOCK'" class="item-badge">
                {{ item.badge }}
              </div>

              <!-- OUT OF STOCK OVERLAY -->
              <div v-if="item.status === 'OUT_OF_STOCK'" class="out-of-stock-overlay">
                Out of stock
              </div>
            </div>

            <div class="item-content">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="item-rating" v-if="item.rating != null">
                <span class="stars">
                  <span v-for="s in 5" :key="s" class="star" :class="`star--${starType(item.rating ?? 0, s)}`">
                    ★
                  </span>
                </span>

                <span class="rating-number">
                  {{ (item.rating ?? 0).toFixed(1) }}
                </span>

                <span class="rating-count"> ({{ item.ratingCount ?? 0 }}) </span>
              </div>

              <p class="item-description">{{ item.description }}</p>

              <div class="item-tags">
                <span v-for="tag in item.tags" :key="tag" class="item-tag">
                  {{ tag }}
                </span>
              </div>

              <div class="item-footer">
                <div class="item-price">
                  <span class="currency">฿</span>
                  <span class="amount">{{ item.price }}</span>
                </div>
                <!-- IF NOT IN CART -->
                <button v-if="!getCartItem(item.id)" class="item-btn" @click="addToCart(item)">
                  Add to bag
                </button>

                <!-- IF IN CART -->
                <div v-else class="qty-control">
                  <button @click="decreaseQty(item.id)">-</button>
                  <span>{{ getCartItem(item.id)?.quantity }}</span>
                  <button @click="increaseQty(getCartItem(item.id)?.cartId)">+</button>
                </div>
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

          <button type="button" class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
            Next
          </button>
        </div>
      </section>

      <!-- STICKY CART SUMMARY -->
      <transition name="fade-up">
        <div v-if="cartCount > 0" class="cart-summary">
          <div class="cart-summary-info">
            <span class="cart-summary-count">{{ cartCount }} item{{ cartCount > 1 ? 's' : '' }}</span>
            <span class="cart-summary-text">in your bag</span>
          </div>
          <button type="button" class="cart-summary-btn" @click="goToCart">View bag</button>
        </div>
      </transition>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useCategoryStore } from '../stores/useCategoryStore'
import { useMenuItemsStore } from '../stores/useMenuItemStore'

const cartStore = useCartStore()
const { items: cartItems } = storeToRefs(cartStore)

type ShopItem = {
  id: number
  name: string
  tags: string[]
  price: number
  description: string
  size?: string
  badge?: string
  imageUrl: string
  rating?: number
  ratingCount?: number
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'INACTIVE'
}

const router = useRouter()
const menuItemsStore = useMenuItemsStore()
const categoriesStore = useCategoryStore()
const { items: menuItems } = storeToRefs(menuItemsStore)
const { items: categories } = storeToRefs(categoriesStore)

onMounted(() => {
  if (!menuItems.value.length) {
    menuItemsStore.fetchAll()
  }
  if (!categories.value.length) {
    categoriesStore.fetchAll()
  }
})

const items = computed<ShopItem[]>(() =>
  menuItems.value
    .filter((i) => i.status !== 'INACTIVE')
    .map((i) => {
      const cheapestSize = i.sizes?.length
        ? i.sizes.reduce((min, s) => (s.sellPrice < min.sellPrice ? s : min))
        : null

      const activeImages = i.images?.filter((img: any) => img.active) ?? []

      const primaryImage =
        activeImages.find((img: any) => img.primary)?.url || activeImages[0]?.url || ''

      return {
        id: i.id,
        name: i.name,
        tags: (i.tags ?? []).map((t: any) => t.name),
        price: cheapestSize?.sellPrice ?? i.price,
        description: i.shortDesc || 'CafeShop special',
        badge: i.category.toLowerCase(),

        sizes: i.sizes ?? [],
        defaultSize: cheapestSize ?? null,

        imageUrl: primaryImage,
        rating: i.averageRating ?? 0,
        ratingCount: i.ratingCount ?? 0,
        status: i.status,
      }
    }),
)

const allCategories = computed(() => [
  { value: 'all', label: 'All items' },
  ...categories.value.map((c) => ({
    value: c.slug,
    label: c.name,
  })),
])

watch(categories, (val) => {
  console.log("Categories loaded:", val)
})

function goToDetails(id: number) {
  router.push({ name: 'product-details', params: { id } })
}

const currentPage = ref(1)
const pageSize = ref(12)
const searchText = ref('')
const selectedCategory = ref<string>('all')

const showingCount = computed(() => paginatedItems.value.length)

const filteredItems = computed(() => {
  const text = searchText.value.trim().toLowerCase()
  const cat = selectedCategory.value

  return items.value.filter((item) => {
    const byCategory = cat === 'all' || item.badge === cat
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

const cartCount = computed(() => cartItems.value.reduce((sum, i) => sum + i.quantity, 0))

function getCartItem(id: number) {
  return cartItems.value.find((i) => i.productId === id)
}

function addToCart(item: any) {
  const size = item.defaultSize

  if (!size) return

  cartStore.addItem({
    productId: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,

    sizeId: size.id,
    sizeName: size.shortName,
    ingredients: [],

    quantity: 1,

    unitPrice: size.sellPrice,
    totalPrice: size.sellPrice,
    totalIngredientPrice: 0,
  })
}
function increaseQty(cartId?: number) {
  if (!cartId) return
  cartStore.increaseQty(cartId)
}

function decreaseQty(cartId?: number) {
  if (!cartId) return
  cartStore.decreaseQty(cartId)
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
