<!-- src/views/admin/MenuItemCreate.vue -->
<template>
  <main class="content product-form-page">
    <!-- HEADER -->
    <section class="panel product-form-header">
      <div class="product-form-header-left">
        <button class="back-link" type="button" @click="goBack">← Back to menu items</button>

        <h1 class="product-form-title">Add product</h1>
        <p class="product-form-subtitle">
          Create a new item for CafeShop menu. Images, steps and ingredients will be used on the
          customer product page.
        </p>
      </div>

      <div class="product-form-header-right">
        <span class="product-form-pill">SKU: {{ form.sku || 'not set' }}</span>
        <span class="product-form-pill product-form-pill--status">
          {{ form.status || 'ACTIVE' }}
        </span>
      </div>
    </section>

    <!-- FORM -->
    <section class="panel product-form-body">
      <form @submit.prevent="onSubmit" class="product-form-grid">
        <!-- LEFT COLUMN: MEDIA + MAIN INFO -->
        <div class="product-form-col">
          <!-- MEDIA (IMAGES) -->
          <div class="media-card">
            <div class="media-top">
              <!-- main image -->
              <div class="media-main">
                <div v-if="activeImage" class="media-main-inner">
                  <img :src="activeImage.url" alt="Product image" />
                </div>
                <div v-else class="media-main-empty">
                  <p>No image yet</p>
                  <p class="media-main-empty-sub">Upload 1–4 images. First one is used as cover.</p>
                </div>
              </div>

              <!-- upload area -->
              <label class="media-upload">
                <span class="media-upload-title">Images</span>
                <span class="media-upload-sub"> Click to choose or drop images (JPG / PNG) </span>
                <input type="file" multiple accept="image/*" class="media-upload-input" @change="onImageSelect" />
              </label>
            </div>

            <!-- thumbnails -->
            <div v-if="images.length" class="media-thumbs">
              <button v-for="(img, index) in images" :key="img.id" type="button" class="media-thumb"
                :class="{ 'media-thumb--active': index === activeImageIndex }" @click="setActiveImage(index)">
                <img :src="img.url" alt="Thumbnail" />
              </button>
            </div>
          </div>

          <!-- BASIC INFO -->
          <div class="field field--row">
            <div class="field-group">
              <label class="field-label" for="sku">SKU</label>
              <input id="sku" v-model="form.sku" type="text" class="field-input" placeholder="e.g. DRK-006" />
            </div>

            <div class="field-group field-group--grow">
              <label class="field-label" for="name">Product name</label>
              <input id="name" v-model="form.name" type="text" class="field-input" placeholder="e.g. Salmon Salad"
                required />
            </div>
          </div>

          <div class="field field--row">
            <div class="field-group field-group--grow">
              <label class="field-label" for="categoryId">Category</label>
              <select id="categoryId" v-model="form.categoryId" class="field-input field-select" required>
                <option disabled :value="null">Select category</option>

                <option v-for="c in categoryStore.items" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>

              <p v-if="categoryStore.loading" class="field-hint">Loading categories...</p>
              <p v-if="categoryStore.error" class="form-error">{{ categoryStore.error }}</p>
            </div>
          </div>

          <!-- SIZES -->
          <div class="field">
            <div class="field-label-row">
              <span class="field-label">Sizes</span>
              <button type="button" class="btn-chip" @click="addSizeRow">+ Add size</button>
            </div>

            <div class="ingredients-table">
              <div class="ingredients-header">
                <span>Size</span>
                <span>Sell price (฿)</span>
                <span>Original price (฿)</span>
                <span>Note</span>
                <span></span>
              </div>

              <div v-for="(row, index) in sizes" :key="row.id" class="sizes-row">
                <select v-model="row.sizeId" class="field-input" required>
                  <option disabled :value="null">Select</option>

                  <option v-for="s in sizeStore.items" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>

                <input v-model.number="row.sellPrice" type="number" min="0" step="1"
                  class="field-input field-input--right" placeholder="120" required />

                <input v-model.number="row.originalPrice" type="number" min="0" step="1"
                  class="field-input field-input--right" placeholder="150" />

                <input v-model="row.desc" type="text" class="field-input" placeholder="e.g. Regular" />

                <button type="button" class="sizes-remove" @click="removeSizeRow(index)" :disabled="sizes.length === 1"
                  title="Remove row">
                  ✕
                </button>
              </div>
            </div>

            <p class="field-hint">Prices are defined per size.</p>
          </div>

          <div class="field">
            <label class="field-label" for="shortDesc">Short description</label>
            <textarea id="shortDesc" v-model="form.shortDesc" class="field-input field-textarea" rows="3"
              placeholder="Tomatoes, nori, feta cheese, mushrooms..."></textarea>
          </div>

          <!-- INGREDIENTS -->
          <div class="field">
            <div class="field-label-row">
              <span class="field-label">Ingredients</span>
              <button type="button" class="btn-chip" @click="addIngredientRow">
                + Add ingredient
              </button>
            </div>

            <div class="ingredients-table">
              <div class="ingredients-header">
                <span>Ingredient</span>
                <span>Amount</span>
                <span>Price (฿)</span>
                <span>Note</span>
                <span></span>
              </div>

              <div v-for="(row, index) in ingredients" :key="row.id" class="ingredients-row">
                <input v-model="row.name" type="text" class="field-input ingredients-input"
                  placeholder="e.g. Caramel" />

                <input v-model="row.amount" type="text" class="field-input ingredients-input" placeholder="e.g. 1 pc" />

                <input v-model.number="row.price" type="number" min="0" step="0.01"
                  class="field-input field-input--right" placeholder="10" />

                <input v-model="row.note" type="text" class="field-input ingredients-input" placeholder="e.g. melted" />

                <button type="button" class="btn-icon" @click="removeIngredientRow(index)"
                  :disabled="ingredients.length === 1">
                  ✕
                </button>
              </div>
            </div>

            <p class="field-hint">
              These will appear in the “Ingredients” tab on the product page.
            </p>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="product-form-col product-form-col--side">
          <div class="field">
            <div class="field-label">Available in</div>
            <div class="chip-group">
              <button
  type="button"
  class="chip"
  :class="{ 'chip--active': form.availableIn === 'CAFE_ONLY' }"
  @click="form.availableIn = 'CAFE_ONLY'"
>
  Cafe only
</button>

<button
  type="button"
  class="chip"
  :class="{ 'chip--active': form.availableIn === 'ROOM_SERVICE_ONLY' }"
  @click="form.availableIn = 'ROOM_SERVICE_ONLY'"
>
  Room service only
</button>

<button
  type="button"
  class="chip"
  :class="{ 'chip--active': form.availableIn === 'BOTH' }"
  @click="form.availableIn = 'BOTH'"
>
  Both
</button>

            </div>
          </div>

          <div class="field">
            <label class="field-label" for="status">Status</label>
            <select id="status" v-model="form.status" class="field-input field-select">
              <option value="ACTIVE">Active</option>
              <option value="HIDDEN">Hidden</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
            </select>
            <p class="field-hint">
              <strong>Active</strong> items appear on the menu. Use <strong>Hidden</strong> while
              preparing photos or descriptions.
            </p>
          </div>

          <div class="field">
            <div class="field-label-row">
              <span class="field-label">Tags</span>
              <span v-if="tagStore.loading" class="field-hint">Loading tags...</span>
            </div>

            <div v-if="tagStore.error" class="form-error">{{ tagStore.error }}</div>

            <div class="tag-picker">
              <label v-for="t in tagStore.items" :key="t.id" class="tag-pill"
                :class="{ 'tag-pill--active': isTagSelected(t.id) }">
                <input class="tag-pill-input" type="checkbox" :checked="isTagSelected(t.id)"
                  @change="toggleTag(t.id)" />
                {{ t.name }}
              </label>
            </div>

            <p class="field-hint">Choose one or more tags for filtering and labels.</p>
          </div>

          <div class="field">
            <label class="field-label" for="internalNote">Internal note</label>
            <textarea id="internalNote" v-model="form.internalNote" class="field-input field-textarea" rows="3"
              placeholder="Kitchen / barista note, allergens, preparation tips…"></textarea>
          </div>

          <div class="product-form-actions">
            <button type="button" class="btn-secondary" @click="goBack" :disabled="saving">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save product' }}
            </button>
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../stores/useCategoryStore'
import { useMenuItemsStore } from '../../stores/useMenuItemStore'
import { useSizeStore } from '../../stores/useSizeStore'
import { useTagStore } from '../../stores/useTagStore'

import { onMounted } from 'vue'
const tagStore = useTagStore()

const router = useRouter()
const menuItemsStore = useMenuItemsStore()
const sizeStore = useSizeStore()
const categoryStore = useCategoryStore()

type ProductStatus = 'ACTIVE' | 'HIDDEN' | 'OUT_OF_STOCK'
type AvailableIn = 'CAFE_ONLY' | 'ROOM_SERVICE_ONLY' | 'BOTH'


type ProductForm = {
  sku: string
  name: string
  shortDesc: string
  status: ProductStatus
  availableIn: AvailableIn
  internalNote: string
  categoryId: number | null
  tagIds: number[]
}

const form = reactive<ProductForm>({
  sku: '',
  name: '',
  shortDesc: '',
  status: 'ACTIVE',
  availableIn: 'BOTH',
  internalNote: '',
  categoryId: null,
  tagIds: [],
})

onMounted(async () => {
  await Promise.all([
    tagStore.items.length ? Promise.resolve() : tagStore.fetchAll(),
    categoryStore.items.length ? Promise.resolve() : categoryStore.fetchAll(),
    sizeStore.items.length ? Promise.resolve() : sizeStore.fetchAll(),
  ])
})

function toggleTag(id: number) {
  const idx = form.tagIds.indexOf(id)
  if (idx === -1) form.tagIds.push(id)
  else form.tagIds.splice(idx, 1)
}

function isTagSelected(id: number) {
  return form.tagIds.includes(id)
}

/* ---------- SIZES ---------- */

type SizeRow = {
  id: number
  sizeId: number | null
  sellPrice: number | null
  originalPrice: number | null
  desc: string
}

const sizes = ref<SizeRow[]>([
  { id: 1, sizeId: null, sellPrice: null, originalPrice: null, desc: '' },
])

function addSizeRow() {
  const id = Date.now() + Math.random()
  sizes.value.push({ id, sizeId: null, sellPrice: null, originalPrice: null, desc: '' })
}

function removeSizeRow(index: number) {
  if (sizes.value.length === 1) return
  sizes.value.splice(index, 1)
}

/* ---------- IMAGES / GALLERY (preview only) ---------- */

type ProductImage = { id: number; url: string; file: File }
const images = ref<ProductImage[]>([])
const activeImageIndex = ref(0)
const activeImage = computed(() => images.value[activeImageIndex.value])

function onImageSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  Array.from(files).forEach((file) => {
    images.value.push({ id: Date.now() + Math.random(), url: URL.createObjectURL(file), file })
  })

  if (images.value.length === files.length) activeImageIndex.value = 0
  input.value = ''
}

function setActiveImage(index: number) {
  activeImageIndex.value = index
}

/* ---------- INGREDIENTS ---------- */

type IngredientRow = {
  id: number
  name: string
  amount: string
  price: number | null
  note: string
}

const ingredients = ref<IngredientRow[]>([
  { id: 1, name: '', amount: '', price: null, note: '' },
])


function addIngredientRow() {
  const id = Date.now() + Math.random()
  ingredients.value.push({ id, name: '', amount: '', price: null, note: '' })
}


function removeIngredientRow(index: number) {
  if (ingredients.value.length === 1) return
  ingredients.value.splice(index, 1)
}

/* ---------- BUILD REQUEST BODY ---------- */

function normalizeSizeRows() {
  return sizes.value.map((r) => {
    if (!r.sizeId) throw new Error('Please select size for all size rows.')
    if (r.sellPrice == null) throw new Error('Sell price is required for all size rows.')

    return {
      sizeId: r.sizeId,
      sellPrice: r.sellPrice,
      originalPrice: r.originalPrice ?? null,
      desc: r.desc?.trim() || null,
    }
  })
}

function normalizeIngredientRows() {
  return ingredients.value
    .filter((r) => r.name.trim().length > 0)
    .map((r) => ({
      name: r.name.trim(),
      amount: r.amount?.trim() || null,
      price: r.price ?? null,
      note: r.note?.trim() || null,
    }))
}

// TEMP: backend expects tagIds. We'll send [] until you implement tag select.
function resolveTagIds(): number[] {
  return []
}

/* ---------- SAVE / NAV ---------- */

const saving = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  saving.value = true
  error.value = null

  try {
    if (!form.categoryId) throw new Error('Category is required.')

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      shortDesc: form.shortDesc.trim(),
      status: form.status,
      availableIn: form.availableIn,
      internalNote: form.internalNote.trim(),
      categoryId: form.categoryId,
      tagIds: form.tagIds,
      sizes: normalizeSizeRows(),
      ingredients: normalizeIngredientRows(),
    }

    await menuItemsStore.create(payload)
    await menuItemsStore.fetchAll()

    router.push({ name: 'admin-menu' })
  } catch (e: any) {
    error.value = e?.message || 'Failed to save product'
    console.error(e)
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push({ name: 'admin-menu' })
}
</script>

<style scoped src="@/styles/admin/menu-item-form.css"></style>
