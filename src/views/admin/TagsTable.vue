
<template>
  <main class="content">
    <!--  HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Tags</h1>
        <p class="menu-subtitle">Manage Tags.</p>
      </div>

      <button class="menu-btn-primary" @click="showCreateModal = true"> + Add Tag</button>
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
    :page-size="10"
    @page-change="onPageChange">

    <!-- ACTIONS -->
    <template #cell-actions="{row}">
      <button class="btn-link" @click="editTag(row)">Edit</button>
      <button class="btn-link btn-link--danger" @click="removeTag(row)">Delete</button>
    </template>
    </AdminTable>

    <!-- CREATE TAG MODAL -->
<div v-if="showCreateModal" class="modal-backdrop">
  <div class="modal">
    <h2>Create Tag</h2>

    <input
      v-model="newTagName"
      type="text"
      placeholder="Tag name"
      class="modal-input"
    />

    <div class="modal-actions">
      <button class="btn-link btn-link--danger" @click="closeModal">
        Cancel
      </button>

      <button
        class="menu-btn-primary"
        :disabled="!newTagName || isSubmitting"
        @click="createTag"
      >
        Create
      </button>
    </div>
  </div>
</div>
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue';
import { useTagStore } from '../../stores/useTagStore';


  const router = useRouter()
  const tagStore = useTagStore()
  const showCreateModal = ref(false)
  const newTagName = ref('')
  const isSubmitting = ref(false)

  onMounted(() => {
    tagStore.fetchAll()
  })

  const tagColumns: TableColumn[] = [
    {key: 'name', label: 'Name'},
    {key: 'actions', label: '', align: 'right', width: '140px'}
  ]

  const search = ref('')
  const filteredTags = computed(() => {
    const s = search.value.trim().toLowerCase()
    return tagStore.items.filter((t) => !s || t.name.toLowerCase().includes(s))
  })

  function onPageChange(page: number) {
    console.log('Tag page -> ', page)
  }

  function closeModal() {
    showCreateModal.value = false
    newTagName.value = ''
  }

  async function createTag() {
  if (!newTagName.value.trim()) return

  try {
    isSubmitting.value = true

    await tagStore.create({
      name: newTagName.value
    })

    closeModal()
  } finally {
    isSubmitting.value = false
  }
  }

  function editTag(row: any) {
    router.push({name: 'admin-tag-edit', params: {id: row.id}})
  }

  function removeTag(row: any) {
    if(!confirm(`Are you sure you want to delete "${row.name}"`)) {return}
    tagStore.remove(row.id)
  }
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>

