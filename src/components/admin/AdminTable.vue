<template>
  <section class="panel admin-table-panel">
    <div class="panel-header" v-if="title">
      <h2 class="panel-title">{{ title }}</h2>
      <span class="panel-caption">
        {{ totalItems }} items · page {{ currentPage }} / {{ totalPages }}
      </span>
    </div>

    <div class="table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width || 'auto', textAlign: col.align || 'left' }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- empty state -->
          <tr v-if="pagedRows.length === 0">
            <td :colspan="columns.length">No data.</td>
          </tr>

          <!-- ✅ IMPORTANT: use pagedRows (same as debug version) -->
          <tr v-for="row in pagedRows" :key="getRowKey(row)">
            <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align || 'left' }">
              <!-- column-specific slot -->
              <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ Pagination bar -->
    <div class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ‹ Prev
      </button>

      <button
        v-for="page in pageNumbers"
        :key="page"
        class="pagination-btn"
        :class="{ 'pagination-btn--active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next ›
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export type TableColumn = {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

const props = defineProps<{
  columns: TableColumn[]
  rows: any[]
  title?: string
  pageSize?: number
  enablePagination?: boolean
  rowKey?: string | ((row: any) => string | number)
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const pageSize = computed(() => props.pageSize ?? 10)
const currentPage = ref(1)

const totalItems = computed(() => props.rows.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const pagedRows = computed(() => {
  // (same logic as debug version)
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.rows.slice(start, end)
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

watch(
  () => props.rows,
  () => {
    currentPage.value = 1
  },
)

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emit('page-change', page)
}

function getRowKey(row: any): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (typeof props.rowKey === 'string') return row[props.rowKey] ?? JSON.stringify(row)
  return row.id ?? JSON.stringify(row)
}
</script>

<style scoped src="@/styles/admin/admin-table.css"></style>
