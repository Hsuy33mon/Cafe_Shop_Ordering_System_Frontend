<template>
  <div class="pd-page">
    <main class="pd-main">
      <!-- TOP BREADCRUMB -->
      <section class="cs-container pd-breadcrumb">
        <span class="pd-breadcrumb-text">
          Home / Shop /
          <span class="pd-breadcrumb-current">Product</span>
        </span>
      </section>

      <!-- TOP LAYOUT: IMAGE + MAIN INFO -->
      <section class="cs-container pd-top">
        <!-- LEFT: SINGLE IMAGE -->
        <div class="pd-image-card">
          <!-- MAIN SLIDE -->
          <div class="pd-image-main">
            <div class="pd-image-label" v-if="product.label">
              <span class="pd-label-dot"></span>
              <span>{{ product.label }}</span>
            </div>
            <img :src="currentImage" :alt="product.name" class="pd-image" />

            <!-- arrows -->
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

          <button type="button" class="pd-zoom-btn" aria-label="View larger">⤢</button>
        </div>

        <!-- RIGHT: INFO -->
        <div class="pd-info-card">
          <header class="pd-header">
            <div class="pd-title-row">
              <h1 class="pd-title">{{ product.name }}</h1>
              <div class="pd-price-pill">฿{{ product.price }}</div>
            </div>

            <div class="pd-rating-row">
              <span class="pd-stars">
                <span
                  v-for="n in 5"
                  :key="n"
                  :class="['pd-star', { 'pd-star--muted': n > product.rating }]"
                >
                  ★
                </span>
              </span>
              <span class="pd-rating-text">
                {{ product.rating.toFixed(1) }} ({{ product.ratingCount }} ratings)
              </span>
            </div>

            <p class="pd-short-desc">
              {{ product.description }}
            </p>
          </header>

          <!-- STEPS ROW -->
          <section class="pd-steps">
            <article v-for="step in steps" :key="step.number" class="pd-step">
              <div class="pd-step-number">{{ step.number }}</div>
              <div class="pd-step-body">
                <p class="pd-step-title">{{ step.title }}</p>
                <p class="pd-step-text">{{ step.text }}</p>
              </div>
            </article>
          </section>

          <!-- ACTIONS: QTY + ADD TO CART -->
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
              <span> {{ isInCart ? 'Added to cart' : 'Add to cart' }} </span>
            </button>
          </footer>
        </div>
      </section>

      <!-- TABS + DETAILS -->
      <section class="cs-container pd-tabs-section">
        <!-- tab buttons -->
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

        <!-- tab content -->
        <div class="pd-tab-panel">
          <!-- INGREDIENTS TABLE -->
          <div v-if="activeTab === 'ingredients'" class="pd-spec-grid">
            <div
              v-for="row in ingredientRows"
              :key="row.left.label + row.right.label"
              class="pd-spec-row"
            >
              <div class="pd-spec-cell">
                <span class="pd-spec-label">{{ row.left.label }}</span>
                <span class="pd-spec-value">{{ row.left.value }}</span>
              </div>
              <div class="pd-spec-cell">
                <span class="pd-spec-label">{{ row.right.label }}</span>
                <span class="pd-spec-value">{{ row.right.value }}</span>
              </div>
            </div>
          </div>

          <!-- PRODUCT DETAILS -->
          <div v-else-if="activeTab === 'details'" class="pd-text-panel">
            <p>
              Freshly prepared at CafeShop with carefully selected ingredients. Perfect as a light
              lunch or cozy dinner in your room.
            </p>
            <p>
              If you have specific dietary requirements (gluten-free, dairy-free, etc.), please add
              it in the order notes and our team will try to accommodate.
            </p>
          </div>

          <!-- REVIEWS -->
          <!-- REVIEWS -->
          <div v-else class="pd-reviews">
            <!-- summary -->
            <div class="pd-reviews-summary">
              <div>
                <div class="pd-reviews-stars">
                  <span
                    v-for="n in 5"
                    :key="'avg-' + n"
                    :class="['pd-star', { 'pd-star--muted': n > Math.round(averageRating) }]"
                  >
                    ★
                  </span>
                </div>
                <p class="pd-reviews-summary-text">
                  {{ averageRating.toFixed(1) }} out of 5 · {{ reviews.length }} review{{
                    reviews.length === 1 ? '' : 's'
                  }}
                </p>
              </div>
            </div>

            <!-- list -->
            <div v-if="reviews.length" class="pd-reviews-list">
              <article v-for="review in reviews" :key="review.id" class="pd-review-card">
                <div class="pd-review-header">
                  <p class="pd-review-name">{{ review.name }}</p>
                  <span class="pd-review-date">{{ review.createdAt }}</span>
                </div>

                <div class="pd-review-stars">
                  <span
                    v-for="n in 5"
                    :key="review.id + '-' + n"
                    :class="['pd-star', { 'pd-star--muted': n > review.rating }]"
                  >
                    ★
                  </span>
                </div>

                <p class="pd-review-comment">
                  {{ review.comment }}
                </p>
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
                  <span class="pd-review-rating-hint"> {{ newReviewRating }} / 5 </span>
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

      <!-- BOUGHT TOGETHER -->
      <section class="cs-container pd-bought-section">
        <header class="pd-bought-header">
          <h2 class="pd-bought-title">It is usually bought together with this product</h2>
          <p class="pd-bought-text">
            Guests often pair this dish with a drink or dessert. Add one more to complete your meal.
          </p>
        </header>

        <div class="pd-bought-row">
          <article v-for="item in boughtTogether" :key="item.id" class="pd-bought-card">
            <div class="pd-bought-media" @click="goToDetails(item.id)">
              <img :src="item.imageUrl" :alt="item.name" />
            </div>

            <div class="pd-bought-body">
              <p class="pd-bought-name">{{ item.name }}</p>
              <p class="pd-bought-desc">
                {{ item.description }}
              </p>
            </div>

            <div class="pd-bought-footer">
              <span class="pd-bought-price">฿{{ item.price }}</span>
              <button type="button" class="pd-bought-btn">Add to cart</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

type Product = {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  images?: string[]
  label?: string
  rating: number
  ratingCount: number
}

type IngredientRow = {
  left: { label: string; value: string }
  right: { label: string; value: string }
}

const route = useRoute()
const productId = Number(route.params.id || 1)

function goToDetails(id: number) {
  router.push({ name: 'product-details', params: { id } })
}

// Mock product – replace with API / Pinia later
const allProducts: Product[] = [
  {
    id: 1,
    name: 'Saumon Gravlax',
    price: 19,
    description: 'Tomatoes, nori, feta cheese, mushrooms, rice noodles, corn, shrimp.',
    imageUrl:
      'https://images.pexels.com/photos/2893630/pexels-photo-2893630.jpeg?auto=compress&w=800',
    images: [
      'https://images.pexels.com/photos/2893630/pexels-photo-2893630.jpeg?auto=compress&w=800',
      'https://images.pexels.com/photos/3731477/pexels-photo-3731477.jpeg?auto=compress&w=800',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&w=800',
    ],
    label: 'Vegan',
    rating: 5,
    ratingCount: 4,
  },
  {
    id: 2,
    name: 'Chevrefrit Bowl',
    price: 14,
    description: 'Colorful salad bowl with fresh veggies and feta cheese.',
    imageUrl:
      'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&w=800',
    label: 'Vegan',
    rating: 4.8,
    ratingCount: 12,
  },
]

const product = computed(() => allProducts.find((p) => p.id === productId) ?? allProducts[0])

const steps = [
  {
    number: '01',
    title: 'Add to the cart and place an order',
    text: 'Choose your quantity and confirm your room or table number at checkout.',
  },
  {
    number: '02',
    title: 'Enter your phone number and address',
    text: 'We’ll contact you only if we need clarification about your order.',
  },
  {
    number: '03',
    title: 'Enjoy your favorite food at home!',
    text: 'Sit back while we prepare and deliver everything fresh to you.',
  },
]

const quantity = ref(1)
const isInCart = ref(false)

function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

function toggleCart() {
  isInCart.value = !isInCart.value
  // later: call your real cart store / API here
}

// Tabs
const activeTab = ref<'ingredients' | 'details' | 'reviews'>('ingredients')
const tabList = [
  { value: 'ingredients', label: 'Ingredients' },
  { value: 'details', label: 'Product details' },
  { value: 'reviews', label: 'Reviews' },
]

// Example ingredient table rows
const ingredientRows = computed<IngredientRow[]>(() => [
  {
    left: { label: 'Salmon', value: '1 pack' },
    right: { label: 'Porro', value: '2 pack' },
  },
  {
    left: { label: 'Capers', value: '150g' },
    right: { label: 'Facilis', value: '1kg' },
  },
  {
    left: { label: 'Adipisicing', value: '500g' },
    right: { label: 'Goluptatem', value: '1 teaspoon' },
  },
  {
    left: { label: 'Dolorem obcaecati', value: '3 teaspoon' },
    right: { label: 'Vel fuga', value: '300g' },
  },
])

// Bought-together mock
const boughtTogether = computed<Product[]>(() =>
  allProducts.filter((p) => p.id !== product.value.id),
)
type Review = {
  id: number
  name: string
  rating: number
  comment: string
  createdAt: string
}

// existing data...

// --- Reviews state ---
const reviews = ref<Review[]>([
  {
    id: 1,
    name: 'Hotel guest',
    rating: 5,
    comment: 'Very fresh and light, perfect for a quick lunch in the room.',
    createdAt: 'Today',
  },
  {
    id: 2,
    name: 'Nay Chi',
    rating: 4,
    comment: 'Portion size is good, would love a little more dressing next time.',
    createdAt: 'Yesterday',
  },
])

const newReviewName = ref('')
const newReviewRating = ref(5)
const newReviewComment = ref('')
const reviewSubmitted = ref(false)

const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return sum / reviews.value.length
})

function submitReview() {
  if (!newReviewName.value.trim() || !newReviewComment.value.trim()) {
    return
  }

  reviews.value.unshift({
    id: Date.now(),
    name: newReviewName.value.trim(),
    rating: newReviewRating.value,
    comment: newReviewComment.value.trim(),
    createdAt: 'Just now',
  })

  newReviewName.value = ''
  newReviewRating.value = 5
  newReviewComment.value = ''
  reviewSubmitted.value = true

  setTimeout(() => {
    reviewSubmitted.value = false
  }, 3000)
}

// --- IMAGE SLIDER ---
const currentImageIndex = ref(0)

const productImages = computed<string[]>(() => {
  const p = product.value
  if (!p) return []
  if (p.images && p.images.length > 0) return p.images
  return [p.imageUrl]
})

const currentImage = computed(() => {
  const imgs = productImages.value
  if (!imgs.length) return ''
  const idx = Math.min(currentImageIndex.value, imgs.length - 1)
  return imgs[idx]
})

function nextImage() {
  const total = productImages.value.length
  if (total === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % total
}

function prevImage() {
  const total = productImages.value.length
  if (total === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + total) % total
}

function goToImage(index: number) {
  if (index < 0 || index >= productImages.value.length) return
  currentImageIndex.value = index
}
</script>

<style scoped>
.pd-page {
  background-color: #f9fafb;
  min-height: 100vh;
}

.pd-main {
  padding-block: 2.5rem 3.5rem;
}

/* breadcrumb */
.pd-breadcrumb {
  margin-bottom: 1.4rem;
}
.pd-breadcrumb-text {
  font-size: 0.85rem;
  color: #9ca3af;
}
.pd-breadcrumb-current {
  color: #111827;
  font-weight: 600;
}

/* top layout */
.pd-top {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.5fr);
  gap: 2.5rem;
  align-items: flex-start;
}

/* IMAGE CARD */
.pd-image-card {
  position: relative;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 1.5rem 1.8rem 1.1rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
}

/* label stays same */
.pd-image-label {
  position: absolute;
  top: 1.2rem;
  left: 1.6rem;
  background-color: #15803d;
  color: #ecfdf5;
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.pd-label-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #bbf7d0;
}

/* fixed-size main image */
.pd-image-main {
  border-radius: 2px;
  overflow: hidden;
  background-color: #f3f4f6;
  aspect-ratio: 4 / 3; /* 👈 same size for all slides */
  position: relative;
}

.pd-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* arrows */
.pd-image-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background-color: rgba(15, 23, 42, 0.55);
  color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
}
.pd-image-nav-btn--left {
  left: 0.6rem;
}
.pd-image-nav-btn--right {
  right: 0.6rem;
}

/* thumbnails row */
.pd-thumb-row {
  margin-top: 0.65rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.pd-thumb {
  flex: 0 0 70px;
  aspect-ratio: 4 / 3;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  background: none;
  cursor: pointer;
}
.pd-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pd-thumb--active {
  border-color: #facc15;
}

/* zoom button (same as before, but sits above thumbs) */
.pd-zoom-btn {
  position: absolute;
  right: 1.8rem;
  bottom: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
}

/* INFO CARD */
.pd-info-card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 1.6rem 1.8rem 1.8rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
}

.pd-header {
  margin-bottom: 1.1rem;
}

.pd-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.6rem;
}

.pd-title {
  font-size: 1.3rem;
  font-weight: 700;
}

.pd-price-pill {
  background-color: #facc15;
  padding: 0.4rem 1rem;
  border-radius: 0;
  font-weight: 700;
}

/* rating */
.pd-rating-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.45rem;
}
.pd-stars {
  display: flex;
  gap: 0.05rem;
}
.pd-star {
  font-size: 0.9rem;
  color: #facc15;
}
.pd-star--muted {
  color: #e5e7eb;
}
.pd-rating-text {
  font-size: 0.78rem;
  color: #6b7280;
}

/* short desc */
.pd-short-desc {
  font-size: 0.9rem;
  color: #4b5563;
}

/* steps */
.pd-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.3rem;
  margin-top: 1.2rem;
}

.pd-step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background-color: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.pd-step-title {
  font-size: 0.85rem;
  font-weight: 600;
}

.pd-step-text {
  font-size: 0.78rem;
  color: #6b7280;
}

/* actions */
.pd-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.4rem;
}

.pd-qty-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.pd-qty-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
}

.pd-qty-value {
  min-width: 32px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
}

.pd-add-btn {
  border: none;
  padding: 0.65rem 1.4rem;
  background-color: #facc15;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.pd-add-btn--added {
  background-color: #111827;
  color: #f9fafb;
}

/* TABS SECTION */
.pd-tabs-section {
  margin-top: 2.5rem;
}

.pd-tabs {
  display: inline-flex;
  border: 1px solid #e5e7eb;
}

.pd-tab-btn {
  padding: 0.4rem 1.4rem;
  font-size: 0.8rem;
  border: none;
  background-color: #f9fafb;
  cursor: pointer;
}

.pd-tab-btn + .pd-tab-btn {
  border-left: 1px solid #e5e7eb;
}

.pd-tab-btn--active {
  background-color: #facc15;
  font-weight: 600;
}

.pd-tab-panel {
  margin-top: 1.1rem;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  padding: 1.2rem 1.4rem;
}

/* ingredients grid */
.pd-spec-grid {
  display: grid;
  gap: 0.75rem; /* increased row spacing */
}

.pd-spec-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0.45rem 0; /* more vertical spacing */
  border-bottom: 1px solid #f3f4f6;
  column-gap: 2rem; /* ADD more spacing between left/right columns */
}

.pd-spec-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 1rem; /* add breathing room before next column */
}

.pd-spec-label {
  font-size: 0.85rem;
  color: #4b5563;
}

.pd-spec-value {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-left: 0.75rem; /* small spacing between text inside a cell */
}

/* text tabs */
.pd-text-panel p {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.5;
}

.pd-text-panel p + p {
  margin-top: 0.4rem;
}

/* bought together */
.pd-bought-section {
  margin-top: 2.6rem;
}

.pd-bought-header {
  margin-bottom: 1.2rem;
}

.pd-bought-title {
  font-size: 1.05rem;
  font-weight: 700;
}

.pd-bought-text {
  font-size: 0.85rem;
  color: #6b7280;
}

.pd-bought-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.pd-bought-card {
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
}

.pd-bought-media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.pd-bought-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pd-bought-body {
  padding: 0.6rem 0.75rem 0.5rem;
}

.pd-bought-name {
  font-size: 0.86rem;
  font-weight: 600;
}

.pd-bought-desc {
  font-size: 0.78rem;
  color: #6b7280;
  margin-top: 0.15rem;
}

.pd-bought-footer {
  padding: 0.6rem 0.75rem 0.7rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pd-bought-price {
  font-weight: 700;
  font-size: 0.85rem;
}

.pd-bought-btn {
  border: none;
  font-size: 0.78rem;
  padding: 0.35rem 0.8rem;
  background-color: #facc15;
  cursor: pointer;
}

/* responsive */
@media (max-width: 900px) {
  .pd-top {
    grid-template-columns: minmax(0, 1fr);
  }

  .pd-bought-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .pd-main {
    padding-block: 2rem 3rem;
  }

  .pd-steps {
    grid-template-columns: minmax(0, 1fr);
  }

  .pd-bought-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* --- REVIEWS TAB --- */
.pd-reviews {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pd-reviews-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.6rem;
}

.pd-reviews-stars {
  display: flex;
  gap: 0.05rem;
}

.pd-reviews-summary-text {
  font-size: 0.82rem;
  color: #6b7280;
  margin-top: 0.1rem;
}

/* reuse star styles */
.pd-star {
  font-size: 0.9rem;
  color: #facc15;
}
.pd-star--muted {
  color: #e5e7eb;
}

/* list */
.pd-reviews-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.pd-review-card {
  padding: 0.6rem 0.2rem 0.4rem;
  border-bottom: 1px solid #f3f4f6;
}

.pd-review-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.1rem;
}

.pd-review-name {
  font-size: 0.86rem;
  font-weight: 600;
}

.pd-review-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.pd-review-comment {
  font-size: 0.82rem;
  color: #4b5563;
  margin-top: 0.2rem;
}

.pd-reviews-empty {
  font-size: 0.82rem;
  color: #6b7280;
}

/* form */
.pd-review-form {
  margin-top: 0.4rem;
  padding-top: 0.6rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pd-review-form-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.pd-review-form-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pd-review-label {
  font-size: 0.78rem;
  color: #6b7280;
}

.pd-review-input,
.pd-review-textarea {
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  font-size: 0.85rem;
  padding: 0.4rem 0.55rem;
  outline: none;
}

.pd-review-input:focus,
.pd-review-textarea:focus {
  border-color: #facc15;
}

/* star rating input */
.pd-review-stars-input {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.pd-star-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #e5e7eb;
  padding: 0;
}

.pd-star-btn--active {
  color: #facc15;
}

.pd-review-rating-hint {
  font-size: 0.78rem;
  color: #6b7280;
  margin-left: 0.3rem;
}

.pd-review-submit {
  align-self: flex-start;
  border: none;
  padding: 0.45rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: #111827;
  color: #f9fafb;
  cursor: pointer;
}

.pd-review-success {
  font-size: 0.78rem;
  color: #16a34a;
}
.pd-bought-media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  cursor: pointer; /* 👈 */
}
.pd-bought-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
