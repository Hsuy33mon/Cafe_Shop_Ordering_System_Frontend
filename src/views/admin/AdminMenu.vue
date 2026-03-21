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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
          <option value="TEST">Test</option>
        </select>

        <select v-model="availabilityFilter" class="filter-select">
          <option value="">All times</option>
          <option value="CAFE_ONLY">Cafe only</option>
          <option value="ROOM_SERVICE_ONLY">Room service</option>
          <option value="BOTH">Cafe & Room</option>
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
      <template #cell-price="{ value }">
        <div class="price-list" v-if="Array.isArray(value)">
          <span v-for="price in value" :key="price.id ?? price.name" class="menu-tag">
            {{ tag.name ?? tag }}
          </span>
        </div>
        ฿{{ value }}
      </template>

      <!-- Status pill -->
      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <!-- Tags -->
      <template #cell-tags="{ value }">
        <div class="tag-list" v-if="Array.isArray(value)">
          <span v-for="tag in value" :key="tag.id ?? tag.name" class="menu-tag">
            {{ tag.name ?? tag }}
          </span>
        </div>
      </template>

      <!-- Actions -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editProduct(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="toggleActive(row)">
          {{ row.status === 'ACTIVE' ? 'Disable' : 'Activate' }}
        </button>
        <!-- <button class="btn-link btn-link--danger" @click="toggleActive(row)">
          {{ row.status === 'Active' ? 'Disable' : 'Activate' }}
        </button> -->
      </template>
    </AdminTable>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { useRouter } from 'vue-router'
import { useMenuItemsStore, type MenuItem, type ProductStatus } from '@/stores/useMenuItemStore'

const router = useRouter()
const menuItemsStore = useMenuItemsStore()

onMounted(() => {
  menuItemsStore.fetchAll()
})

const productColumns: TableColumn[] = [
  { key: 'sku', label: 'SKU', width: '90px' },
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'availableIn', label: 'Available' },
  { key: 'price', label: 'Price (฿)', align: 'right', width: '120px' },
  { key: 'status', label: 'Status', width: '120px' },
  { key: 'tags', label: 'Tags' },
  { key: 'actions', label: '', align: 'right', width: '140px' },
]

// filters
const search = ref('')
const categoryFilter = ref<string>('')
const statusFilter = ref<string>('')
const availabilityFilter = ref<string>('')

const categoryOptions = computed(() => menuItemsStore.categoryOptions)

const filteredProducts = computed(() => {
  const s = search.value.trim().toLowerCase()

  return menuItemsStore.items.filter((p) => {
    const matchesSearch =
      !s ||
      p.name.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s) ||
      p.tags.some((t) => t.toLowerCase().includes(s))

    const matchesCategory = !categoryFilter.value || p.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || p.status === statusFilter.value
    const matchesAvailability =
      !availabilityFilter.value || p.availableIn === availabilityFilter.value

    return matchesSearch && matchesCategory && matchesStatus && matchesAvailability
  })
})

function onPageChange(page: number) {
  console.log('Menu items page ->', page)
}

function editProduct(row: MenuItem) {
  router.push({ name: 'admin-menu-edit', params: { id: row.id } })
}

async function toggleActive(row: MenuItem) {
  const next: ProductStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

  try {
    await menuItemsStore.updateStatus(row.id, next)
  } catch {}
}

// async function toggleActive(row: MenuItem) {
//   const next: ProductStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

//   try {
//     await menuItemsStore.updateStatus(row.id,{...row,status: next})
//   } catch {
//     // store.error already set
//   }
// }

function statusClass(status: ProductStatus) {
  return {
    'status-pill--new': status === 'ACTIVE',
    'status-pill--prep': status === 'INACTIVE',
    'status-pill--ready': status === 'OUT_OF_STOCK',
    'status-pill--test': status === 'TEST',
  }
}

function goToAddProduct() {
  router.push({ name: 'admin-menu-new' })
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
