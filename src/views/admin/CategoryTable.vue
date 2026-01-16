<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Categories</h1>
        <p class="menu-subtitle">Manage menu categories.</p>
      </div>
      <button class="menu-btn-primary" @click="openCreateModal">+ Add category</button>
    </section>

    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by category name ..."
        />
      </div>
    </section>

    <!-- CATEGORY TABLE -->
    <AdminTable
      :columns="categoryColumns"
      :rows="filteredCategories"
      title="All categories"
      :page-size="10"
      @page-change="onPageChange"
    >
      <!-- Actions -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editCategory(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="removeCategory(row)">Delete</button>
      </template>
    </AdminTable>

    <!-- CREATE CATEGORY MODAL -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h2>{{isEditMode ? 'Update Category' : 'Create Category'}}</h2>

        <input
          v-model="categoryName"
          type="text"
          placeholder="Category name"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="btn-link btn-link--danger" @click="closeModal">Cancel</button>

          <button
            class="menu-btn-primary"
            :disabled="!categoryName || isSubmitting"
            @click="submitCategory"
          >
            {{isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '../../stores/useCategoryStore'

const categoryStore = useCategoryStore()
const showModal = ref(false)
const categoryName = ref('')
const isEditMode = ref(false)
const editingCategoryId = ref<number | null>(null)
const isSubmitting= ref(false)

onMounted(() => {
  categoryStore.fetchAll()
})

const categoryColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'menuItemCount', label: 'Number of Menu Item' },
  { key: 'updatedAt', label: ' UpdatedAt' },
  { key: 'actions', label: 'Actions', align: 'center', width: '140px' },
]

const search = ref('')
const filteredCategories = computed(() => {
  const s = search.value.trim().toLowerCase()

  return categoryStore.items.filter((c) => !s || c.name.toLowerCase().includes(s))
})

function onPageChange(page: number) {
  console.log('Category page -> ', page)
}

function closeModal() {
  isEditMode.value = false
  editingCategoryId.value = null
  categoryName.value = ''
  showModal.value = false
}

function openCreateModal(){
  isEditMode.value = false
  editingCategoryId.value = null
  categoryName.value = ''
  showModal.value = true

}


async function submitCategory() {
  if (!categoryName.value.trim()) return

  try {
    isSubmitting.value = true

    if(isEditMode.value && editingCategoryId.value !== null){
      await categoryStore.update(editingCategoryId.value , {name: categoryName.value})
    }else{
      await categoryStore.create({name: categoryName.value})
    }
    closeModal()
  } finally {
    isSubmitting.value = false
  }
}

function editCategory(row: any) {
  isEditMode.value = true
  editingCategoryId.value = row.id
  categoryName.value = row.name
  showModal.value = true
}

function removeCategory(row: any) {
  if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
    return
  }
  categoryStore.remove(row.id)
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
