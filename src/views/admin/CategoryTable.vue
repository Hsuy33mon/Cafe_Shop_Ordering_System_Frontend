<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Categories</h1>
        <p class="menu-subtitle">Manage menu categories.</p>
      </div>
      <button class="menu-btn-primary" @click="showCreateModal = true">+ Add category</button>
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
    <div v-if="showCreateModal" class="modal-backdrop">
      <div class="modal">
        <h2>Create Category</h2>

        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Category name"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="btn-link btn-link--danger" @click="closeModal">Cancel</button>

          <button
            class="menu-btn-primary"
            :disabled="!newCategoryName || isSubmitting"
            @click="createCategory"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '../../stores/useCategoryStore'

  const router = useRouter()
  const categoryStore = useCategoryStore()
  const showCreateModal = ref(false)
  const newCategoryName = ref('')
  const isSubmitting = ref(false)


onMounted(() => {
  categoryStore.fetchAll()
})

const categoryColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'menuItemCount', label: 'Number of Menu Item' },
  { key: 'updatedAt', label: ' UpdatedAt' },
  { key: 'actions', label: '', align: 'right', width: '140px' },
]

const search = ref('')
const filteredCategories = computed(() => {
  const s = search.value.trim().toLowerCase()

  return categoryStore.items.filter((c) => !s || c.name.toLowerCase().includes(s))
})


  function onPageChange(page: number){
    console.log('Category page -> ', page)
  }

  function closeModal() {
    showCreateModal.value = false
    newCategoryName.value = ''
  }

  async function createCategory() {
  if (!newCategoryName.value.trim()) return

  try {
    isSubmitting.value = true

    await categoryStore.create({
      name: newCategoryName.value
    })

    closeModal()
  } finally {
    isSubmitting.value = false
  }
}

  function editCategory(row: any){
    router.push({name : 'admin-category-edit', params: {id: row.id}})
  }

  function removeCategory(row: any){
    if(!confirm(`Are you sure you want to delete "${row.name}"?`)){
      return
    }
      categoryStore.remove(row.id)
  }

</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
