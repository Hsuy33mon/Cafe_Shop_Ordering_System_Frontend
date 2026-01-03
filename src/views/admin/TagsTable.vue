<template>
  <main class="content">
    <!--  HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Tags</h1>
        <p class="menu-subtitle">Manage Tags.</p>
      </div>

      <button class="menu-btn-primary" @click="goToAddTag">+ Add Tag</button>
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
      @page-change="onPageChange"
    >
      <!-- ACTIONS -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editTag(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="removeTag(row)">Delete</button>
      </template>
    </AdminTable>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminTable, { type TableColumn } from '../../components/admin/AdminTable.vue'
import { useTagStore } from '../../stores/useTagStore'

const router = useRouter()
const tagStore = useTagStore()

onMounted(() => {
  tagStore.fetchAll()
})

const tagColumns: TableColumn[] = [{ key: 'name', label: 'Name' }]

const search = ref('')
const filteredTags = computed(() => {
  const s = search.value.trim().toLowerCase()
  return tagStore.items.filter((t) => !s || t.name.toLowerCase().includes(s))
})

function onPageChange(page: number) {
  console.log('Tag page -> ', page)
}

function goToAddTag() {
  router.push({ name: 'admin-tag-new' })
}

function editTag(row: any) {
  router.push({ name: 'admin-tag-edit', params: { id: row.id } })
}

function removeTag(row: any) {
  if (!confirm(`Are you sure you want to delete "${row.name}"`)) {
    return
  }
  tagStore.remove(row.id)
}
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>
