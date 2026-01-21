<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Sizes</h1>
        <p class="menu-subtitle">Manage sizes.</p>
      </div>

      <button class="menu-btn-primary" @click="openCreateModal">+ Add size</button>
    </section>

    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by size name..."
        />
      </div>
    </section>

    <!-- SIZE TABLE -->
    <AdminTable
      :columns="sizeColumns"
      :rows="filteredSizes"
      title="All sizes"
      :page-size="10"
      @page-change="onPageChange"
    >
      <!-- ACTIONS -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editSize(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="removeSize(row)">Delete</button>
      </template>
    </AdminTable>

    <!-- CREATE SIZE MODAL -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h2>{{ isEditMode ? 'Update Size' : 'Create Size' }}</h2>

        <input v-model="form.name" type="text" placeholder="Size name" class="modal-input" />

        <input
          v-model="form.shortName"
          type="text"
          placeholder="Short name (e.g. S, M, L)"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="btn-link btn-link--danger" @click="closeModal">Cancel</button>

          <button
            class="menu-btn-primary"
            :disabled="!form.name || !form.shortName || isSubmitting"
            @click="submitSize"
          >
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue'
import { useSizeStore } from '../../stores/useSizeStore'

const sizeStore = useSizeStore()
const showModal = ref(false)
const isEditMode = ref(false)
const editingSizeId = ref<number | null>(null)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  shortName: '',
})

onMounted(() => {
  sizeStore.fetchAll()
})

const sizeColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'shortName', label: 'Short Name' },
  { key: 'actions', label: 'Actions', align: 'right', width: '140px' },
]

const search = ref('')
const filteredSizes = computed(() => {
  const s = search.value.trim().toLowerCase()
  return sizeStore.items.filter((x) => !s || x.name.toLowerCase().includes(s))
})

function onPageChange(page: number) {
  console.log('Size page -> ', page)
}

function closeModal() {
  isEditMode.value = false
  editingSizeId.value = null
  form.value = { name: '', shortName: '' }
  showModal.value = false
}

function openCreateModal() {
  isEditMode.value = false
  editingSizeId.value = null
  form.value = { name: '', shortName: '' }
  showModal.value = true
}

async function submitSize() {
  if (!form.value.name.trim() || !form.value.shortName.trim()) return

  try {
    isSubmitting.value = true
    if (isEditMode.value && editingSizeId.value !== null) {
      await sizeStore.update(editingSizeId.value, {
        name: form.value.name,
        shortName: form.value.shortName,
        active: true,
      })
    } else {
      await sizeStore.create({
        name: form.value.name,
        shortName: form.value.shortName,
      })
    }

    closeModal()
  } finally {
    isSubmitting.value = false
  }
}

function editSize(row: any) {
  isEditMode.value = true
  editingSizeId.value = row.id
  form.value = {
    name: row.name,
    shortName: row.shortName,
  }
  showModal.value = true
}

function removeSize(row: any) {
  if (!confirm(`Are you sure you want to delete "${row.name}"?`)) return
  sizeStore.remove(row.id)
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
