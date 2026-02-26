<template>
  <main class="content">
    <!--  HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Tags</h1>
        <p class="menu-subtitle">Manage Tags.</p>
      </div>
      <button class="menu-btn-primary" @click="openCreateModal">+ Add Tag</button>
    </section>

    <!-- SEARCH BAR  -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by tag name..."
        />
      </div>
    </section>

    <!-- Tag Table -->
    <AdminTable
      :columns="tagColumns"
      :rows="filteredTags"
      title="All Tags"
      :page-size="20"
      @page-change="onPageChange"
    >
      <!-- ACTIONS -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editTag(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="removeTag(row)">Delete</button>
      </template>
    </AdminTable>

    <!-- CREATE TAG MODAL -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h2>{{ isEditingMode ? 'Update Tag' : 'Create Tag' }}</h2>

        <input v-model="tagName" type="text" placeholder="Tag name" class="modal-input" />

        <div class="modal-actions">
          <button class="btn-link btn-link--danger" @click="closeModal">Cancel</button>

          <button class="menu-btn-primary" :disabled="!tagName || isSubmitting" @click="submitTag">
            {{ isEditingMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue'
import { useTagStore } from '../../stores/useTagStore'

const tagStore = useTagStore()
const showModal = ref(false)
const tagName = ref('')
const isEditingMode = ref(false)
const editingTagId = ref<number | null>(null)
const isSubmitting = ref(false)

onMounted(() => {
  tagStore.fetchAll()
})

const tagColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'actions', label: 'Actions', align: 'right', width: '140px' },
]

function onPageChange(page: number) {
  console.log('Tag page -> ', page)
}
const search = ref('')
const filteredTags = computed(() => {
  const s = search.value.trim().toLowerCase()
  return tagStore.items.filter((t) => !s || t.name.toLowerCase().includes(s))
})

function closeModal() {
  showModal.value = false
  tagName.value = ''
  isEditingMode.value = false
  editingTagId.value = null
}

function openCreateModal() {
  showModal.value = true
  tagName.value = ''
  isEditingMode.value = false
  editingTagId.value = null
}

async function submitTag() {
  if (!tagName.value.trim()) return

  try {
    isSubmitting.value = true

    if (isEditingMode.value && editingTagId.value !== null) {
      await tagStore.update(editingTagId.value, { name: tagName.value })
    } else {
      await tagStore.create({ name: tagName.value })
    }

    closeModal()
  } finally {
    isSubmitting.value = false
  }
}

function editTag(row: any) {
  showModal.value = true
  tagName.value = row.name
  isEditingMode.value = true
  editingTagId.value = row.id
}

function removeTag(row: any) {
  if (!confirm(`Are you sure you want to delete "${row.name}"`)) {
    return
  }
  tagStore.remove(row.id)
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
