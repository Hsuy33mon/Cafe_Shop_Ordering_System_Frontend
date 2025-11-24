<template>
  <main class="content">
    <!-- HEADER + ACTIONS -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Menu items</h1>
        <p class="menu-subtitle">Manage all products available in CafeShop menu.</p>
      </div>

      <button class="menu-btn-primary" @click="goToAddProduct">+ Add product</button>
    </section>

    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by name, category, tags…"
        />

        <select v-model="categoryFilter" class="filter-select">
          <option value="">All categories</option>
          <option v-for="cat in categoryOptions" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select v-model="statusFilter" class="filter-select">
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Hidden">Hidden</option>
          <option value="Out of stock">Out of stock</option>
        </select>

        <select v-model="availabilityFilter" class="filter-select">
          <option value="">All times</option>
          <option value="Cafe">Cafe only</option>
          <option value="Room">Room service</option>
          <option value="Both">Cafe & Room</option>
        </select>
      </div>
    </section>

    <!-- PRODUCTS TABLE -->
    <AdminTable
      :columns="productColumns"
      :rows="filteredProducts"
      title="All products"
      :page-size="10"
      @page-change="onPageChange"
    >
      <!-- Price: right aligned with ฿ -->
      <template #cell-price="{ value }"> ฿{{ value }} </template>

      <!-- Status pill -->
      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <!-- Tags -->
      <template #cell-tags="{ value }">
        <div class="tag-list" v-if="Array.isArray(value)">
          <span v-for="tag in value" :key="tag" class="menu-tag">
            {{ tag }}
          </span>
        </div>
      </template>

      <!-- Actions -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editProduct(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="toggleActive(row)">
          {{ row.status === 'Active' ? 'Disable' : 'Activate' }}
        </button>
      </template>
    </AdminTable>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

type ProductStatus = 'Active' | 'Hidden' | 'Out of stock'
type Availability = 'Cafe' | 'Room' | 'Both'

type ProductRow = {
  id: number
  sku: string
  name: string
  category: string
  price: number
  status: ProductStatus
  availability: Availability
  tags: string[]
  updatedAt: string
}

const productColumns: TableColumn[] = [
  { key: 'sku', label: 'SKU', width: '90px' },
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'availability', label: 'Available' },
  { key: 'price', label: 'Price (฿)', align: 'right', width: '120px' },
  { key: 'status', label: 'Status', width: '120px' },
  { key: 'tags', label: 'Tags' },
  { key: 'updatedAt', label: 'Updated' },
  { key: 'actions', label: '', align: 'right', width: '140px' },
]

// demo data – later replace with API
const products = ref<ProductRow[]>([
  {
    id: 1,
    sku: 'DRK-001',
    name: 'Iced Caramel Latte',
    category: 'Coffee & drinks',
    price: 95,
    status: 'Active',
    availability: 'Both',
    tags: ['signature', 'sweet'],
    updatedAt: '2025-11-18 10:32',
  },
  {
    id: 2,
    sku: 'DRK-002',
    name: 'Americano',
    category: 'Coffee & drinks',
    price: 80,
    status: 'Active',
    availability: 'Both',
    tags: ['classic'],
    updatedAt: '2025-11-18 09:10',
  },
  {
    id: 3,
    sku: 'FOD-010',
    name: 'Gourmet Burger set',
    category: 'Burgers & mains',
    price: 260,
    status: 'Active',
    availability: 'Cafe',
    tags: ['popular', 'lunch'],
    updatedAt: '2025-11-17 18:45',
  },
  {
    id: 4,
    sku: 'DES-003',
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 140,
    status: 'Active',
    availability: 'Both',
    tags: ['sweet'],
    updatedAt: '2025-11-17 16:21',
  },
  {
    id: 5,
    sku: 'DRK-005',
    name: 'Matcha Latte',
    category: 'Coffee & drinks',
    price: 90,
    status: 'Out of stock',
    availability: 'Both',
    tags: ['matcha'],
    updatedAt: '2025-11-16 14:05',
  },
  {
    id: 6,
    sku: 'FOD-020',
    name: 'Saumon Gravlax',
    category: 'Burgers & mains',
    price: 260,
    status: 'Hidden',
    availability: 'Cafe',
    tags: ['special'],
    updatedAt: '2025-11-15 20:00',
  },
])

// filters
const search = ref('')
const categoryFilter = ref<string>('')
const statusFilter = ref<string>('')
const availabilityFilter = ref<string>('')

const categoryOptions = computed(() => {
  const set = new Set<string>()
  products.value.forEach((p) => set.add(p.category))
  return Array.from(set)
})

// filtered rows (AdminTable will handle pagination)
const filteredProducts = computed(() => {
  const s = search.value.trim().toLowerCase()

  return products.value.filter((p) => {
    const matchesSearch =
      !s ||
      p.name.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s) ||
      p.tags.some((t) => t.toLowerCase().includes(s))

    const matchesCategory = !categoryFilter.value || p.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || p.status === statusFilter.value
    const matchesAvailability =
      !availabilityFilter.value || p.availability === availabilityFilter.value

    return matchesSearch && matchesCategory && matchesStatus && matchesAvailability
  })
})

function onPageChange(page: number) {
  console.log('Menu items page ->', page)
}

// UI actions – demo only
function editProduct(row: ProductRow) {
  // later: navigate to edit page or open drawer
  console.log('Edit product', row.id)
}

function toggleActive(row: ProductRow) {
  if (row.status === 'Active') {
    row.status = 'Hidden'
  } else {
    row.status = 'Active'
  }
}

function statusClass(status: ProductStatus) {
  return {
    'status-pill--new': status === 'Active',
    'status-pill--prep': status === 'Hidden',
    'status-pill--ready': status === 'Out of stock',
  }
}
function goToAddProduct() {
  router.push({ name: 'admin-menu-new' })
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
