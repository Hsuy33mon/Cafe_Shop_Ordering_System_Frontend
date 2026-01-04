<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Sizes</h1>
        <p class="menu-subtitle">Manage sizes.</p>
      </div>

      <button class="menu-btn-primary" @click="showCreateModal = true">
        + Add size
      </button>
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
        <button class="btn-link btn-link--danger" @click="removeSize(row)">
          Delete
        </button>
      </template>
    </AdminTable>

    <!-- CREATE SIZE MODAL -->
    <div v-if="showCreateModal" class="modal-backdrop">
      <div class="modal">
        <h2>Create Size</h2>

        <input
          v-model="form.name"
          type="text"
          placeholder="Size name"
          class="modal-input"
        />

        <input
          v-model="form.shortName"
          type="text"
          placeholder="Short name (e.g. S, M, L)"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="btn-link btn-link--danger" @click="closeModal">
            Cancel
          </button>

          <button
            class="menu-btn-primary"
            :disabled="!form.name || !form.shortName || isSubmitting"
            @click="createSize"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue'
import { useSizeStore } from '../../stores/useSizeStore'

const router = useRouter()
const sizeStore = useSizeStore()

const showCreateModal = ref(false)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  shortName: ''
})

onMounted(() => {
  sizeStore.fetchAll()
})

const sizeColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'shortName', label: 'Short Name' },
  { key: 'actions', label: '', align: 'right', width: '140px' }
]

const search = ref('')
const filteredSizes = computed(() => {
  const s = search.value.trim().toLowerCase()
  return sizeStore.items.filter(
    (x) => !s || x.name.toLowerCase().includes(s)
  )
})

function onPageChange(page: number) {
  console.log('Size page -> ', page)
}

function closeModal() {
  showCreateModal.value = false
  form.value = { name: '', shortName: '' }
}

async function createSize() {
  if (!form.value.name.trim() || !form.value.shortName.trim()) return

  try {
    isSubmitting.value = true
    await sizeStore.create({
      name: form.value.name,
      shortName: form.value.shortName
    })
    closeModal()
  } finally {
    isSubmitting.value = false
  }
}

function editSize(row: any) {
  router.push({ name: 'admin-size-edit', params: { id: row.id } })
}

function removeSize(row: any) {
  if (!confirm(`Are you sure you want to delete "${row.name}"?`)) return
  sizeStore.remove(row.id)
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
