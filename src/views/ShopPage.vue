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
            v-for="(item, index) in filteredItems"
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
import { computed, ref } from 'vue'
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
    description: 'Rich, syrupy espresso roast with notes of caramel and dark chocolate.',
    size: '250 g · Whole beans',
    badge: 'New',
    imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
  },
  {
    id: 3,
    name: 'CafeShop Tumbler',
    category: 'Bottles & cups',
    price: 280,
    description: 'Insulated stainless-steel tumbler to keep your latte warm on the go.',
    size: '400 ml · Double wall',
    imageUrl: 'https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg',
  },
  {
    id: 4,
    name: 'Ceramic Mug Set',
    category: 'Bottles & cups',
    price: 420,
    description: 'Two matte ceramic mugs in our cafe color palette.',
    size: '2 x 320 ml',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
  },
  {
    id: 5,
    name: 'CafeShop Tote Bag',
    category: 'Merch',
    price: 190,
    description: 'Lightweight cotton tote with a subtle CafeShop illustration.',
    size: 'One size',
    badge: 'Limited',
    imageUrl: 'https://images.pexels.com/photos/3738614/pexels-photo-3738614.jpeg',
  },
  {
    id: 6,
    name: 'Gift Card – Brunch for Two',
    category: 'Gift cards',
    price: 600,
    description: 'Includes two mains, two drinks and a shared dessert.',
    size: 'Digital · Single use',
    imageUrl: 'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg',
  },
])

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
</script>

<style scoped>
.shop-page {
  position: relative;
  background: radial-gradient(circle at top left, #fff7d6 0, #f9fafb 40%, #eef2ff 100%);
  min-height: 100vh;
  overflow: hidden;
}

/* background shapes */
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
  background: #f97316;
  top: -60px;
  right: 8%;
  animation: floatShape 18s ease-in-out infinite;
}

.bg-shape--two {
  width: 220px;
  height: 220px;
  background: #a855f7;
  bottom: -80px;
  left: 4%;
  animation: floatShape 22s ease-in-out infinite;
}

.shop-main {
  padding-block: 2.6rem 3.4rem;
  position: relative;
  z-index: 1;
}

/* ---------- HERO ---------- */
.hero {
  margin-bottom: 2.3rem;
}

.hero-header {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 1.4rem;
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

.hero-title {
  margin-top: 0.7rem;
  margin-bottom: 0.25rem;
}

.hero-subtitle {
  margin-top: 0.4rem;
  font-size: 0.95rem;
}

/* filters */
.hero-filters {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
}

.input-wrapper {
  position: relative;
  min-width: 260px;
  max-width: 360px;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.65;
}

.search-input {
  width: 100%;
  padding: 0.65rem 0.9rem 0.65rem 2.1rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
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

.search-input:focus {
  border-color: #facc15;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.98);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.tab-btn {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(255, 255, 255, 0.85);
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition:
    background 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.tab-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.tab-btn--active {
  background: linear-gradient(135deg, #facc15, #f97316);
  border-color: transparent;
  color: #111827;
}

/* ---------- ITEMS GRID ---------- */
.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.8rem;
}

/* 3 columns on tablet/desktop */
@media (min-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.item-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(248, 250, 252, 0.95);
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  opacity: 0;
  animation: cardIn 0.65s ease-out forwards;
  animation-delay: calc(0.03s * var(--stagger));
}

.item-media {
  position: relative;
  padding-top: 70%;
  overflow: hidden;
}

.item-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-out;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.item-badge {
  position: absolute;
  left: 0.9rem;
  top: 0.9rem;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  background-color: #fef3c7;
  font-size: 0.7rem;
  font-weight: 600;
  color: #92400e;
}

/* content */
.item-content {
  padding: 0.95rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 700;
}

.item-description {
  font-size: 0.86rem;
  color: #4b5563;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: #6b7280;
}

.item-type {
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  background-color: #f3f4ff;
}

.item-size {
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  background-color: #f3f4f6;
}

/* footer */
.item-footer {
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
}

.item-price {
  display: flex;
  align-items: flex-end;
  gap: 0.05rem;
}

.currency {
  font-size: 0.8rem;
}

.amount {
  font-size: 1.05rem;
  font-weight: 800;
}

.item-btn {
  border-radius: 999px;
  padding: 0.5rem 1.05rem;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #facc15, #f97316);
  color: #111827;
  box-shadow: 0 10px 24px rgba(252, 211, 77, 0.8);
  transition:
    background 0.16s ease-out,
    box-shadow 0.16s ease-out,
    transform 0.12s ease-out;
}

.item-btn:hover {
  box-shadow: 0 14px 34px rgba(252, 211, 77, 0.9);
  transform: translateY(-1px);
}

.item-btn--added {
  background: #111827;
  color: #f9fafb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.6);
}

.item-btn--added::after {
  content: ' ✓';
  font-size: 0.8rem;
}

/* empty state */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  padding-block: 1.5rem;
}

/* ---------- STICKY CART SUMMARY ---------- */
.cart-summary {
  position: fixed;
  right: 1.5rem;
  bottom: 1.4rem;
  z-index: 50;
  background: rgba(17, 24, 39, 0.96);
  color: #f9fafb;
  border-radius: 999px;
  padding: 0.6rem 0.7rem 0.6rem 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.7);
}

.cart-summary-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cart-summary-count {
  font-size: 0.86rem;
  font-weight: 600;
}

.cart-summary-text {
  font-size: 0.78rem;
  color: #d1d5db;
}

.cart-summary-btn {
  border-radius: 999px;
  border: none;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: #facc15;
  color: #111827;
}

/* animations */
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

/* transition for sticky bar */
.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* responsive tweaks */
@media (max-width: 768px) {
  .shop-main {
    padding-block: 2.2rem 3rem;
  }

  .cart-summary {
    left: 1rem;
    right: 1rem;
    justify-content: space-between;
  }
}
</style>
