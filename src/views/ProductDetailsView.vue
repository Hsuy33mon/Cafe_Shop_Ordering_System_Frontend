<template>
  <div class="pd-page">
    <main v-if="product" class="pd-main">
      <!-- SUCCESS MESSAGE -->
      <div v-if="cartSuccessMessage" class="pd-success-banner">
        {{ cartSuccessMessage }}
      </div>

      <!-- TOP BREADCRUMB -->
      <section class="cs-container pd-breadcrumb">
        <span class="pd-breadcrumb-text">
          Home / Shop /
          <span class="pd-breadcrumb-current">Product</span>
        </span>
      </section>

      <!-- TOP LAYOUT: IMAGE + MAIN INFO -->
      <section class="cs-container pd-top">
        <!-- FULLSCREEN ZOOM MODAL -->
        <transition name="fade">
          <div v-if="isZoomOpen" class="zoom-overlay" @click.self="closeZoom">
            <button class="zoom-close" @click="closeZoom">×</button>

            <button
              v-if="productImages.length > 1"
              class="zoom-nav zoom-nav--left"
              @click.stop="prevImage"
            >
              ‹
            </button>

            <img :src="currentImage" :alt="product.name" class="zoom-image" />

            <button
              v-if="productImages.length > 1"
              class="zoom-nav zoom-nav--right"
              @click.stop="nextImage"
            >
              ›
            </button>
          </div>
        </transition>

        <!-- LEFT: IMAGE -->
        <div class="pd-image-card">
          <div class="pd-image-main">
            <div class="pd-image-label" v-if="product.label">
              <span class="pd-label-dot"></span>
              <span>{{ product.label }}</span>
            </div>

            <img :src="currentImage" :alt="product.name" class="pd-image" />

            <button
              v-if="productImages.length > 1"
              type="button"
              class="pd-image-nav-btn pd-image-nav-btn--left"
              @click="prevImage"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              v-if="productImages.length > 1"
              type="button"
              class="pd-image-nav-btn pd-image-nav-btn--right"
              @click="nextImage"
              aria-label="Next image"
            >
              ›
            </button>
          </div>

          <!-- THUMBNAILS -->
          <div v-if="productImages.length > 1" class="pd-thumb-row">
            <button
              v-for="(img, idx) in productImages"
              :key="img + idx"
              type="button"
              class="pd-thumb"
              :class="{ 'pd-thumb--active': idx === currentImageIndex }"
              @click="goToImage(idx)"
            >
              <img :src="img" :alt="`${product.name} ${idx + 1}`" />
            </button>
          </div>

          <button type="button" class="pd-zoom-btn" aria-label="View larger" @click="openZoom">
            ⤢
          </button>
        </div>

        <!-- RIGHT: INFO -->
        <div class="pd-info-card">
          <header class="pd-header">
            <div class="pd-title-row">
              <h1 class="pd-title">{{ product.name }}</h1>
              <div class="pd-price-pill">฿{{ money(finalTotalPrice) }}</div>
            </div>

            <!-- rating summary -->
            <div class="pd-rating-row">
              <span class="pd-stars">
                <span
                  v-for="n in 5"
                  :key="'avg-' + n"
                  :class="['pd-star', { 'pd-star--muted': n > Math.round(averageRating) }]"
                >
                  ★
                </span>
              </span>

              <span class="pd-rating-text">
                ({{ reviewStore.items.length }}) rating{{
                  reviewStore.items.length === 1 ? '' : 's'
                }}
              </span>
            </div>

            <div class="pd-reviews-summary">
              <p class="pd-reviews-summary-text">{{ money(averageRating, 1) }} out of 5</p>
            </div>

            <p class="pd-short-desc">
              {{ product.description }}
            </p>
          </header>

          <!-- SIZE SELECTOR -->
          <div v-if="menuItemsStore.currentItem?.sizes?.length" class="pd-size-section">
            <p class="pd-size-title">Size</p>

            <div class="pd-size-options">
              <button
                v-for="size in menuItemsStore.currentItem.sizes"
                :key="size.id"
                type="button"
                class="pd-size-btn"
                :class="{ 'pd-size-btn--active': size.id === selectedSizeId }"
                @click="selectedSizeId = size.id"
              >
                {{ size.shortName }}
              </button>
            </div>
          </div>

          <!-- ACTIONS -->
          <footer class="pd-actions">
            <div class="pd-qty-control">
              <button type="button" class="pd-qty-btn" @click="decreaseQty">−</button>
              <span class="pd-qty-value">{{ quantity }}</span>
              <button type="button" class="pd-qty-btn" @click="increaseQty">+</button>
            </div>

            <button
              type="button"
              class="pd-add-btn"
              :class="{ 'pd-add-btn--added': isInCart }"
              @click="toggleCart"
            >
              <span>{{ isInCart ? 'Added to cart' : 'Add to cart' }}</span>
            </button>
          </footer>
        </div>
      </section>

      <!-- TABS -->
      <section class="cs-container pd-tabs-section">
        <div class="pd-tabs">
          <button
            v-for="tab in tabList"
            :key="tab.value"
            type="button"
            class="pd-tab-btn"
            :class="{ 'pd-tab-btn--active': activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="pd-tab-panel">
          <!-- INGREDIENTS -->
          <div v-if="activeTab === 'ingredients'" class="pd-ingredients-table">
            <div class="pd-ingredients-header">
              <span></span>
              <span>Name</span>
              <span>Amount</span>
              <span>Price</span>
            </div>

            <div
              v-for="ingredient in activeIngredients"
              :key="ingredient.id"
              class="pd-ingredients-row"
            >
              <input
                type="checkbox"
                :checked="selectedIngredientIds.includes(ingredient.id)"
                @change="toggleIngredient(ingredient.id)"
              />

              <div class="pd-ing-name">
                {{ ingredient.name }}
                <small v-if="ingredient.note" class="pd-ing-note"> ({{ ingredient.note }}) </small>
              </div>

              <span>{{ ingredient.amount ?? '-' }}</span>

              <span class="pd-ing-price">฿{{ money(ingredient.price) }}</span>
            </div>
          </div>

          <!-- REVIEWS -->
          <div v-else class="pd-reviews">
            <div v-if="reviewStore.items.length" class="pd-reviews-list">
              <article v-for="review in reviewStore.items" :key="review.id" class="pd-review-card">
                <div class="pd-review-header">
                  <p class="pd-review-name">{{ review.reviewerName }}</p>
                  <span class="pd-review-date">{{ review.createdAt }}</span>
                </div>

                <div class="pd-review-stars">
                  <span
                    v-for="n in 5"
                    :key="review.id + '-' + n"
                    :class="['pd-star', { 'pd-star--muted': n > (review.rating ?? 0) }]"
                  >
                    ★
                  </span>
                </div>

                <p class="pd-review-comment">{{ review.comment }}</p>
              </article>
            </div>

            <p v-else class="pd-reviews-empty">
              No reviews yet. Be the first to try this menu item and share your feedback!
            </p>

            <!-- write review form -->
            <form class="pd-review-form" @submit.prevent="submitReview">
              <h3 class="pd-review-form-title">Write a review</h3>

              <div class="pd-review-form-row">
                <label class="pd-review-label">Your name</label>
                <input
                  v-model="newReviewName"
                  type="text"
                  class="pd-review-input"
                  placeholder="Eg. Aye Chan"
                  required
                />
              </div>

              <div class="pd-review-form-row">
                <label class="pd-review-label">Your rating</label>
                <div class="pd-review-stars-input">
                  <button
                    v-for="n in 5"
                    :key="'new-' + n"
                    type="button"
                    class="pd-star-btn"
                    :class="{ 'pd-star-btn--active': n <= newReviewRating }"
                    @click="newReviewRating = n"
                  >
                    ★
                  </button>
                  <span class="pd-review-rating-hint">{{ newReviewRating }} / 5</span>
                </div>
              </div>

              <div class="pd-review-form-row">
                <label class="pd-review-label">Your comment</label>
                <textarea
                  v-model="newReviewComment"
                  rows="3"
                  class="pd-review-textarea"
                  placeholder="Tell us what you liked or what could be better…"
                  required
                />
              </div>

              <button type="submit" class="pd-review-submit">Submit review</button>

              <p v-if="reviewSubmitted" class="pd-review-success">
                Thank you! Your review has been added.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuItemsStore } from '../stores/useMenuItemStore'
import { useCartStore } from '../stores/useCartStore'
import { useReviewStore } from '@/stores/useReviewStore'

/* =======================
   Helpers (fix toFixed crash)
======================= */
function toNum(v: unknown, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function money(v: unknown, digits = 2) {
  return toNum(v, 0).toFixed(digits)
}

/* =======================
   Stores
======================= */
const reviewStore = useReviewStore()
const menuItemsStore = useMenuItemsStore()
const cartStore = useCartStore()

/* =======================
   Route + init
======================= */
const route = useRoute()
const productId = toNum(route.params.id, 1)

/* =======================
   UI state
======================= */
const cartSuccessMessage = ref('')
const isZoomOpen = ref(false)
const quantity = ref(1)
const isInCart = ref(false)

const selectedSizeId = ref<number | null>(null)
const selectedIngredientIds = ref<number[]>([])

const activeTab = ref<'ingredients' | 'reviews'>('ingredients')
const tabList = [
  { value: 'ingredients', label: 'Ingredients' },
  { value: 'reviews', label: 'Reviews' },
]

/* =======================
   Zoom / ESC
======================= */
function openZoom() {
  isZoomOpen.value = true
}
function closeZoom() {
  isZoomOpen.value = false
}
function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') closeZoom()
}

onMounted(async () => {
  await menuItemsStore.fetchById(productId)
  await reviewStore.fetchByMenuItem(productId)
  window.addEventListener('keydown', handleEsc)
  restoreFromQuery()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})

/* =======================
   Restore state from query
======================= */
function restoreFromQuery() {
  const sizeId = toNum(route.query.sizeId, 0)
  const qty = toNum(route.query.qty, 0)
  const ingredients = route.query.ingredients as string | undefined

  if (sizeId) selectedSizeId.value = sizeId
  if (qty > 0) quantity.value = qty
  if (ingredients) selectedIngredientIds.value = ingredients.split(',').map((id) => toNum(id, 0))
}

/* =======================
   Product mapping
======================= */
const product = computed(() => {
  const item: any = menuItemsStore.currentItem
  if (!item) return null

  const activeImages =
    item.images
      ?.filter((img: any) => img?.active)
      .map((img: any) => img?.url)
      .filter(Boolean) ?? []

  const primaryImage =
    item.images?.find((img: any) => img?.primary && img?.active)?.url || activeImages[0] || ''

  return {
    id: item.id,
    name: item.name ?? '',
    description: item.shortDesc ?? item.description ?? '',
    label: item.tags?.[0]?.name ?? item.status ?? '',
    imageUrl: primaryImage,
    images: activeImages.length ? activeImages : primaryImage ? [primaryImage] : [],
  }
})

/* =======================
   Sizes / Ingredients
======================= */
const activeIngredients = computed(() => {
  const item: any = menuItemsStore.currentItem
  return (item?.ingredients ?? []).filter((i: any) => i?.active)
})

const cheapestSize = computed(() => {
  const item: any = menuItemsStore.currentItem
  if (!item?.sizes?.length) return null
  return item.sizes.reduce((min: any, s: any) =>
    toNum(s?.sellPrice, 0) < toNum(min?.sellPrice, 0) ? s : min,
  )
})

watch(
  cheapestSize,
  (size) => {
    if (size && !selectedSizeId.value) selectedSizeId.value = size.id
  },
  { immediate: true },
)

const selectedSize = computed(() => {
  const item: any = menuItemsStore.currentItem
  if (!item?.sizes?.length || !selectedSizeId.value) return null
  return item.sizes.find((s: any) => s.id === selectedSizeId.value) ?? null
})

function toggleIngredient(id: number) {
  if (selectedIngredientIds.value.includes(id)) {
    selectedIngredientIds.value = selectedIngredientIds.value.filter((x) => x !== id)
  } else {
    selectedIngredientIds.value.push(id)
  }
}

/* =======================
   Price calculations (always number)
======================= */
const totalIngredientPrice = computed(() => {
  const item: any = menuItemsStore.currentItem
  const ingredients = item?.ingredients ?? []
  return ingredients
    .filter((i: any) => selectedIngredientIds.value.includes(i.id))
    .reduce((sum: number, i: any) => sum + toNum(i?.price, 0), 0)
})

const displayPrice = computed(() => {
  const base = toNum(selectedSize.value?.sellPrice, 0)
  return base + toNum(totalIngredientPrice.value, 0)
})

const finalTotalPrice = computed(() => {
  return toNum(displayPrice.value, 0) * toNum(quantity.value, 1)
})

/* =======================
   Rating
======================= */
const averageRating = computed(() => {
  return toNum(menuItemsStore.currentItem?.averageRating, 0)
})

/* =======================
   Cart actions
======================= */
function increaseQty() {
  quantity.value++
}
function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

function toggleCart() {
  if (!selectedSize.value || !product.value) return

  const current: any = menuItemsStore.currentItem

  const selectedIngredients =
    (current?.ingredients ?? [])
      .filter((i: any) => selectedIngredientIds.value.includes(i.id))
      .map((i: any) => ({
        id: i.id,
        name: i.name,
        price: toNum(i.price, 0),
        amount: i.amount,
      })) ?? []

  const ingTotal = selectedIngredients.reduce((sum: number, i: any) => sum + toNum(i.price, 0), 0)
  const unitPrice = toNum(selectedSize.value.sellPrice, 0) + ingTotal

  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    description: product.value.description,
    imageUrl: product.value.imageUrl,

    sizeId: selectedSize.value.id,
    sizeName: selectedSize.value.shortName,

    ingredients: selectedIngredients,
    quantity: quantity.value,
    unitPrice,

    totalPrice: 0,
    totalIngredientPrice: ingTotal,
  })

  cartSuccessMessage.value = 'Added to cart successfully!'
  setTimeout(() => (cartSuccessMessage.value = ''), 2500)
}

/* =======================
   Reviews
======================= */
const newReviewName = ref('')
const newReviewRating = ref(5)
const newReviewComment = ref('')
const reviewSubmitted = ref(false)

async function submitReview() {
  if (!newReviewName.value.trim() || !newReviewComment.value.trim()) return

  try {
    await reviewStore.create(productId, {
      rating: newReviewRating.value,
      comment: newReviewComment.value.trim(),
      reviewerName: newReviewName.value.trim(),
    })

    await reviewStore.fetchByMenuItem(productId)
    await menuItemsStore.fetchById(productId)

    newReviewName.value = ''
    newReviewRating.value = 5
    newReviewComment.value = ''
    reviewSubmitted.value = true

    setTimeout(() => (reviewSubmitted.value = false), 3000)
  } catch (err) {
    console.error(err)
  }
}

/* =======================
   Image slider
======================= */
const currentImageIndex = ref(0)

const productImages = computed<string[]>(() => {
  const p = product.value
  if (!p) return []
  if (p.images && p.images.length > 0) return p.images
  return p.imageUrl ? [p.imageUrl] : []
})

const currentImage = computed(() => {
  const imgs = productImages.value
  if (!imgs.length) return ''
  const idx = Math.min(currentImageIndex.value, imgs.length - 1)
  return imgs[idx] ?? ''
})

function nextImage() {
  const total = productImages.value.length
  if (!total) return
  currentImageIndex.value = (currentImageIndex.value + 1) % total
}

function prevImage() {
  const total = productImages.value.length
  if (!total) return
  currentImageIndex.value = (currentImageIndex.value - 1 + total) % total
}

function goToImage(index: number) {
  if (index < 0 || index >= productImages.value.length) return
  currentImageIndex.value = index
}
</script>

<style scoped src="@/styles/customer/product-details-page.css"></style>
