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
              <h1 class="pd-title">{{ product?.name }}</h1>
              <!-- <div class="pd-price-pill">฿{{ displayPrice }}</div> -->
              <div class="pd-price-pill">฿{{ finalTotalPrice.toFixed(2) }}</div>
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
                {{ product?.rating?.toFixed(1) }} ({{ product.ratingCount }} ratings)
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

          <!-- SIZE SELECTOR -->
          <div v-if="menuItemsStore.currentItem?.sizes?.length" class="pd-size-section">
            <p class="pd-size-title">Size</p>

            <div class="pd-size-options">
              <button
                v-for="size in menuItemsStore.currentItem.sizes"
                :key="size.size_id"
                type="button"
                class="pd-size-btn"
                :class="{ 'pd-size-btn--active': size.size_id === selectedSizeId }"
                @click="selectedSizeId = size.size_id"
              >
                {{ size.shortName }}
              </button>
            </div>
          </div>

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
          <div v-if="activeTab === 'ingredients'" class="pd-ingredients-table">
            <!-- header -->
            <div class="pd-ingredients-header">
              <span></span>
              <span>Name</span>
              <span>Amount</span>
              <span>Price</span>
            </div>

            <!-- rows -->
            <div
              v-for="ingredient in menuItemsStore.currentItem?.ingredients"
              :key="ingredient.id"
              class="pd-ingredients-row"
            >
              <!-- checkbox -->
              <input
                type="checkbox"
                :disabled="!ingredient.active"
                :checked="selectedIngredientIds.includes(ingredient.id)"
                @change="toggleIngredient(ingredient.id)"
              />

              <!-- name + note -->
              <div class="pd-ing-name">
                {{ ingredient.name }}
                <small v-if="ingredient.note" class="pd-ing-note"> ({{ ingredient.note }}) </small>
              </div>

              <!-- amount -->
              <span>{{ ingredient.amount }}</span>

              <!-- price -->
              <span class="pd-ing-price">฿{{ ingredient.price.toFixed(2) }}</span>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuItemsStore } from '../stores/useMenuItemStore'
import { useCartStore } from '../stores/useCartStore'
const router = useRouter()
const menuItemsStore = useMenuItemsStore()
const cartStore = useCartStore()
const cartSuccessMessage = ref('')

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

// type IngredientRow = {
//   left: { label: string; value: string }
//   right: { label: string; value: string }
// }

const route = useRoute()
const productId = Number(route.params.id || 1)

function goToDetails(id: number) {
  router.push({ name: 'product-details', params: { id } })
}

onMounted(() => {
  menuItemsStore.fetchById(productId)
  restoreFromQuery()
})

function restoreFromQuery() {
  const sizeId = Number(route.query.sizeId)
  const qty = Number(route.query.qty)
  const ingredients = route.query.ingredients as string | undefined

  if (sizeId) {
    selectedSizeId.value = sizeId
  }

  if (qty && qty > 0) {
    quantity.value = qty
  }

  if (ingredients) {
    selectedIngredientIds.value = ingredients.split(',').map((id) => Number(id))
  }
}

const selectedSizeId = ref<number | null>(null)
const selectedIngredientIds = ref<number[]>([])

function toggleIngredient(id: number) {
  if (selectedIngredientIds.value.includes(id)) {
    selectedIngredientIds.value = selectedIngredientIds.value.filter((x) => x !== id)
  } else {
    selectedIngredientIds.value.push(id)
  }
}

const cheapestSize = computed(() => {
  const item = menuItemsStore.currentItem
  if (!item?.sizes?.length) return null

  return item.sizes.reduce((min, s) => (s.sellPrice < min.sellPrice ? s : min))
})

watch(
  cheapestSize,
  (size) => {
    if (size) {
      selectedSizeId.value = size.size_id
    }
  },
  { immediate: true },
)

const selectedSize = computed(() => {
  const item = menuItemsStore.currentItem
  if (!item || !selectedSizeId.value) return null

  return item.sizes.find((s) => s.size_id === selectedSizeId.value) ?? null
})

const totalIngredientPrice = computed(() => {
  const item = menuItemsStore.currentItem
  if (!item?.ingredients?.length) return 0

  return item.ingredients
    .filter((i) => selectedIngredientIds.value.includes(i.id))
    .reduce((sum, i) => sum + (i.price ?? 0), 0)
})

const displayPrice = computed(() => {
  const base = selectedSize.value?.sellPrice ?? 0
  return base + totalIngredientPrice.value
})

const finalTotalPrice = computed(() => {
  return displayPrice.value * quantity.value
})

// const displayPrice = computed(() => {
//   return selectedSize.value?.sellPrice ?? 0
// })

const product = computed(() => {
  const item = menuItemsStore.currentItem
  if (!item) return null

  return {
    id: item.id,
    name: item.name,
    description: item.shortDesc,
    label: item.tags?.[0]?.name ?? item.status,

    price: item.price, // already mapped from first size
    rating: 5,
    ratingCount: 0,

    imageUrl:
      'https://images.pexels.com/photos/2893630/pexels-photo-2893630.jpeg?auto=compress&w=800',

    images: [
      'https://images.pexels.com/photos/2893630/pexels-photo-2893630.jpeg?auto=compress&w=800',
    ],
  }
})

// const ingredientRows = computed<IngredientRow[]>(() => {
//   const item = menuItemsStore.currentItem
//   if (!item?.ingredients?.length) return []

//   const rows: IngredientRow[] = []

//   for (let i = 0; i < item.ingredients.length; i += 2) {
//     rows.push({
//       left: {
//         label: item.ingredients[i].name,
//         value: item.ingredients[i].amount,
//       },
//       right: item.ingredients[i + 1]
//         ? {
//             label: item.ingredients[i + 1].name,
//             value: item.ingredients[i + 1].amount,
//           }
//         : { label: '', value: '' },
//     })
//   }

//   return rows
// })

// const product = computed(() => allProducts.find((p) => p.id === productId) ?? allProducts[0])

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
  if (!selectedSize.value || !product.value) return

  const selectedIngredients =
    menuItemsStore.currentItem?.ingredients
      ?.filter((i) => selectedIngredientIds.value.includes(i.id))
      .map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        amount: i.amount,
      })) ?? []

  const totalIngredientPrice = selectedIngredients.reduce((sum, i) => sum + i.price, 0)

  const unitPrice = selectedSize.value.sellPrice + totalIngredientPrice

  cartStore.addItem({
    productId: product.value.id, // ✅ REQUIRED

    name: product.value.name,
    description: product.value.description,
    imageUrl: product.value.imageUrl,

    sizeId: selectedSize.value.size_id,
    sizeName: selectedSize.value.shortName,

    ingredients: selectedIngredients,

    quantity: quantity.value,
    unitPrice,

    totalPrice: 0, // not used anymore but required by type
    totalIngredientPrice,
  })
  // ✅ SHOW SUCCESS MESSAGE
  cartSuccessMessage.value = 'Added to cart successfully!'

  setTimeout(() => {
    cartSuccessMessage.value = ''
  }, 2500)
}

// function toggleCart() {
//   isInCart.value = !isInCart.value
//   if (!selectedSize.value) return

//   console.log({
//     productId: product.value.id,
//     sizeId: selectedSize.value.size_id,
//     ingredientIds: selectedIngredientIds.value,
//     unitPrice: displayPrice.value,
//     totalPrice: finalTotalPrice.value,
//     qty: quantity.value,
//   })
// }

// Tabs
const activeTab = ref<'ingredients' | 'details' | 'reviews'>('ingredients')
const tabList = [
  { value: 'ingredients', label: 'Ingredients' },
  { value: 'details', label: 'Product details' },
  { value: 'reviews', label: 'Reviews' },
]

// Bought-together mock
const boughtTogether = computed<Product[]>(() => [])

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

<style scoped src="@/styles/customer/product-details-page.css"></style>
