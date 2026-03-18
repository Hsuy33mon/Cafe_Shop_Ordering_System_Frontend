<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="cs-container hero-inner">
        <div class="hero-left">
          <p class="eyebrow">Welcome to 5:1</p>
          <h1 class="hero-title">Feel-good food <span class="highlight">for every mood</span></h1>
          <p class="hero-text">
            Coffee, Tea and desserts – crafted fresh for food lovers. Eat in, grab &amp; go or enjoy
            from your room.
          </p>

          <div class="hero-actions">
            <button type="button" class="btn primary" @click="goToProducts">View menu</button>
            <button type="button" class="btn ghost" @click="goToCart">Order now</button>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">{{ totalMenuItems }}++</span>
              <span class="stat-label">Various Menu</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{overallRating.toFixed(2)}}★</span>
              <span class="stat-label">Guest rating</span>
            </div>
            <!-- <div class="stat">
              <span class="stat-number">15 min</span>
              <span class="stat-label">Avg. prep time</span>
            </div> -->
          </div>
        </div>

        <div class="hero-right">
          <div class="hero-plate">
            <img src="@/assets/logo.jpeg" alt="CafeShop Logo" class="logo-img" />
          </div>
          <!-- <div class="floating-card floating-card--top"> -->
          <div class="floating-card floating-card--bottom">
            <!-- <span class="dot dot--green" /> -->
            <div>
              <p class="floating-label">Served with warmth &amp;</p>
              <p class="floating-text">Brewed with love 🤎</p>
            </div>
          </div>
          <!-- <div class="floating-card floating-card--bottom">
            <p class="floating-text">Served with warmth &amp; Brewed with love 💛</p>
          </div> -->
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <!-- <section class="section categories">
      <div class="cs-container">
        <header class="section-header">
          <p class="eyebrow">Explore</p>
          <h2 class="section-title">For every kind of craving</h2>
          <p class="section-subtitle">
            Cozy coffee or sweet desserts – pick your favourite mood.
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
    </section> -->

    <!-- SPECIALS / HIGHLIGHTED ITEMS -->
    <section class="section specials" id="menu">
      <div class="cs-container">
        <header class="section-header specials-header">
          <div>
            <p class="eyebrow">Best Seller</p>
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
    <!-- <section class="section story">
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
    </section> -->

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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '../stores/useOrderStore'
import { useMenuItemsStore } from '../stores/useMenuItemStore'

const router = useRouter()
const orderStore = useOrdersStore()
const menuItemsStore = useMenuItemsStore()

onMounted(() => {
  orderStore.fetchAll()
  menuItemsStore.fetchAll()
})

const totalMenuItems = computed(
  () => menuItemsStore.items.filter((i) => i.status !== 'INACTIVE').length,
)

const overallRating = computed(() => {
  const items = menuItemsStore.items.filter((i) => i.averageRating != null && i.ratingCount > 0)

  if (!items.length) return 0

  const totalWeighted = items.reduce((sum, item) => sum + item.averageRating * item.ratingCount, 0)

  const totalReviews = items.reduce((sum, item) => sum + item.ratingCount, 0)

  return totalReviews ? totalWeighted / totalReviews : 0
})
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

const specials = computed(() => {
  const orders = orderStore.items
  if (!orders.length) return []

  const counter: Record<number, { count: number }> = {}

  for (const order of orders) {
    if (order.status !== 'COMPLETED') continue

    for (const orderItem of order.items) {
      const menuItem = orderItem.menuItem
      if (!menuItem) continue

      const id = menuItem.id
      if (!counter[id]) {
        counter[id] = { count: 0 }
      }

      counter[id].count += orderItem.quantity ?? 1
    }
  }

  const top3Ids = Object.entries(counter)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)
    .map(([id]) => Number(id))

  return top3Ids
    .map((id, index) => {
      const fullItem = menuItemsStore.items.find((i) => i.id === id)
      if (!fullItem) return null

      const cheapestSize = fullItem.sizes?.length
        ? fullItem.sizes.reduce((min: any, s: any) => (s.sellPrice < min.sellPrice ? s : min))
        : null

      const activeImages = fullItem.images?.filter((img: any) => img.active) ?? []

      const primaryImage =
        activeImages.find((img: any) => img.primary)?.url || activeImages[0]?.url || ''

    return {
      id: fullItem.id,
      name: fullItem.name,
      category: fullItem.category,
      price: cheapestSize?.sellPrice ?? 0,
      description: fullItem.shortDesc,
      imageUrl: primaryImage,
      badge: index === 0 ? '🔥 Most ordered' : 'Popular',
      rating: fullItem.averageRating ?? 0,
      ratingCount: fullItem.ratingCount ?? 0,
    }
  }).filter(Boolean)
})

watch(specials, (val) => {
  console.log("Categories loaded:", val)
})

function goToProducts() {
  router.push('/shop')
}

function goToCart() {
  router.push('/cart')
}
</script>
<style scoped src="@/styles/customer/home-page.css"></style>
