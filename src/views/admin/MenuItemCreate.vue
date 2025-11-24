<!-- src/views/admin/MenuItemCreate.vue -->
<template>
  <main class="content product-form-page">
    <!-- HEADER -->
    <section class="panel product-form-header">
      <div class="product-form-header-left">
        <button class="btn-link" @click="goBack">← Back to menu items</button>

        <h1 class="product-form-title">Add product</h1>
        <p class="product-form-subtitle">
          Create a new item for CafeShop menu. Images, steps and ingredients will be used on the
          customer product page.
        </p>
      </div>

      <div class="product-form-header-right">
        <span class="product-form-pill">SKU: {{ form.sku || 'not set' }}</span>
        <span class="product-form-pill product-form-pill--status">
          {{ form.status || 'Draft' }}
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
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="media-upload-input"
                  @change="onImageSelect"
                />
              </label>
            </div>

            <!-- thumbnails -->
            <div v-if="images.length" class="media-thumbs">
              <button
                v-for="(img, index) in images"
                :key="img.id"
                type="button"
                class="media-thumb"
                :class="{ 'media-thumb--active': index === activeImageIndex }"
                @click="setActiveImage(index)"
              >
                <img :src="img.url" alt="Thumbnail" />
              </button>
            </div>
          </div>

          <!-- BASIC INFO -->
          <div class="field field--row">
            <div class="field-group">
              <label class="field-label" for="sku">SKU</label>
              <input
                id="sku"
                v-model="form.sku"
                type="text"
                class="field-input"
                placeholder="e.g. DRK-006"
              />
            </div>

            <div class="field-group field-group--grow">
              <label class="field-label" for="name">Product name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="field-input"
                placeholder="e.g. Saumon Gravlax"
                required
              />
            </div>
          </div>

          <div class="field field--row">
            <div class="field-group field-group--grow">
              <label class="field-label" for="category">Category</label>
              <select
                id="category"
                v-model="form.category"
                class="field-input field-select"
                required
              >
                <option disabled value="">Select category</option>
                <option>Coffee & drinks</option>
                <option>Burgers & mains</option>
                <option>Desserts</option>
                <option>Breakfast</option>
                <option>Snacks</option>
              </select>
            </div>

            <div class="field-group field-group--price">
              <label class="field-label" for="price">Price (฿)</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                min="0"
                step="1"
                class="field-input field-input--right"
                placeholder="260"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="description">Short description</label>
            <textarea
              id="description"
              v-model="form.description"
              class="field-input field-textarea"
              rows="3"
              placeholder="Tomatoes, nori, feta cheese, mushrooms, rice noodles, corn, shrimp…"
            ></textarea>
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
                <span>Note</span>
                <span></span>
              </div>

              <div v-for="(row, index) in ingredients" :key="row.id" class="ingredients-row">
                <input
                  v-model="row.name"
                  type="text"
                  class="field-input ingredients-input"
                  placeholder="e.g. Salmon"
                />
                <input
                  v-model="row.amount"
                  type="text"
                  class="field-input ingredients-input"
                  placeholder="e.g. 1 pack"
                />
                <input
                  v-model="row.note"
                  type="text"
                  class="field-input ingredients-input"
                  placeholder="e.g. thin slices"
                />
                <button
                  type="button"
                  class="btn-icon"
                  @click="removeIngredientRow(index)"
                  :disabled="ingredients.length === 1"
                  title="Remove row"
                >
                  ✕
                </button>
              </div>
            </div>

            <p class="field-hint">
              These will appear in the “Ingredients” tab on the product page.
            </p>
          </div>
        </div>

        <!-- RIGHT COLUMN: AVAILABILITY / STATUS / INTERNAL INFO -->
        <div class="product-form-col product-form-col--side">
          <div class="field">
            <div class="field-label">Available in</div>
            <div class="chip-group">
              <button
                type="button"
                class="chip"
                :class="{ 'chip--active': form.availableIn === 'Cafe' }"
                @click="form.availableIn = 'Cafe'"
              >
                Cafe only
              </button>
              <button
                type="button"
                class="chip"
                :class="{ 'chip--active': form.availableIn === 'Room' }"
                @click="form.availableIn = 'Room'"
              >
                Room service only
              </button>
              <button
                type="button"
                class="chip"
                :class="{ 'chip--active': form.availableIn === 'Both' }"
                @click="form.availableIn = 'Both'"
              >
                Both
              </button>
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="status">Status</label>
            <select id="status" v-model="form.status" class="field-input field-select">
              <option>Active</option>
              <option>Hidden</option>
              <option>Out of stock</option>
            </select>
            <p class="field-hint">
              <strong>Active</strong> items appear on the menu. Use <strong>Hidden</strong> while
              preparing photos or descriptions.
            </p>
          </div>

          <div class="field">
            <label class="field-label" for="tags">Tags</label>
            <input
              id="tags"
              v-model="form.tags"
              type="text"
              class="field-input"
              placeholder="e.g. signature, sweet, lunch"
            />
            <p class="field-hint">
              Used for filters and labels such as <em>signature</em> or <em>vegan</em>.
            </p>
          </div>

          <div class="field">
            <label class="field-label" for="internalNote">Internal note</label>
            <textarea
              id="internalNote"
              v-model="form.internalNote"
              class="field-input field-textarea"
              rows="3"
              placeholder="Kitchen / barista note, allergens, preparation tips…"
            ></textarea>
          </div>

          <div class="product-form-actions">
            <button type="button" class="btn-secondary" @click="goBack">Cancel</button>
            <button type="submit" class="btn-primary">Save product</button>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type ProductForm = {
  sku: string
  name: string
  category: string
  availableIn: 'Cafe' | 'Room' | 'Both'
  price: number | null
  description: string
  tags: string
  status: 'Active' | 'Hidden' | 'Out of stock'
  internalNote: string
}

const form = reactive<ProductForm>({
  sku: '',
  name: '',
  category: '',
  availableIn: 'Both',
  price: null,
  description: '',
  tags: '',
  status: 'Active',
  internalNote: '',
})

/* ---------- IMAGES / GALLERY ---------- */

type ProductImage = {
  id: number
  url: string
  file: File
}

const images = ref<ProductImage[]>([])
const activeImageIndex = ref(0)

const activeImage = computed(() => images.value[activeImageIndex.value])

function onImageSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file)
    images.value.push({
      id: Date.now() + Math.random(),
      url,
      file,
    })
  })

  if (images.value.length === files.length) {
    activeImageIndex.value = 0
  }

  // clear input so selecting the same file again fires change
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
  note: string
}

const ingredients = ref<IngredientRow[]>([{ id: 1, name: '', amount: '', note: '' }])

function addIngredientRow() {
  const id = Date.now() + Math.random()
  ingredients.value.push({ id, name: '', amount: '', note: '' })
}

function removeIngredientRow(index: number) {
  if (ingredients.value.length === 1) return
  ingredients.value.splice(index, 1)
}

/* ---------- SAVE / NAV ---------- */

function onSubmit() {
  // later: send to API
  const payload = {
    ...form,
    images: images.value,
    ingredients: ingredients.value,
  }
  console.log('Create product payload:', payload)

  router.push({ name: 'admin-menu' }) // adjust name if different
}

function goBack() {
  router.push({ name: 'admin-menu' })
}
</script>

<style scoped src="@/styles/admin/menu-item-form.css"></style>
