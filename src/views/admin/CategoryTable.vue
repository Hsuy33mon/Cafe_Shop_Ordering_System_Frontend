<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Categories</h1>
        <p class="menu-subtitle">Manage menu categories.</p>
      </div>

      <button class="menu-btn-primary" @click="goToAddCategory">
        + Add category
      </button>
    </section>

    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by category name…"
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
        <button
          class="btn-link btn-link--danger"
          @click="toggleActive(row)"
        >
          {{ row.status === 'Active' ? 'Disable' : 'Activate' }}
        </button>
      </template>
    </AdminTable>
  </main>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import AdminTable,{type TableColumn} from '../../components/admin/AdminTable.vue';
import { ref } from 'process';
import { computed } from 'vue';

  const router = useRouter()

  const categoryColumns: TableColumn[] = [
    {key: 'name', label: 'Name'},
    {key: 'slug', label: 'Slug'},
    {key: 'active', label: 'Active'},
    {key: 'menuItemCount', label: 'Number of Menu Item'},
    {key: 'updatedAt', label: ' UpdatedAt'},
    {key: 'createdAt', label: 'CreatedAt'},
    {key: 'actions', label: '', align: 'right', width: '140px'}
  ]

  // const search = ref('')
  // const filteredCategories = computed(() => {

  // })

  function onPageChange(page: number){
    console.log('Category page -> ', page)
  }

  function goToAddCategory(){
    router.push({name : 'admin-category-new'})
  }
</script>

<style scoped src="@/styles/admin/menu-items.css"></style>

