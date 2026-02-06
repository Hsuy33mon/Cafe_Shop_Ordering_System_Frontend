<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters tables-header">
      <div class="tables-header-left">
        <h1 class="tables-title">Tables</h1>
        <p class="tables-subtitle">Live overview of cafe tables, rooms and their current status.</p>
      </div>

      <div class="tables-header-right">
        <span class="tables-pill tables-pill--free"> {{ availableCount }} available </span>
        <span class="tables-pill tables-pill--occupied"> {{ occupiedCount }} occupied </span>
      </div>
    </section>

    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by table, area, note…"
        />

        <select v-model="areaFilter" class="filter-select">
          <option value="">All areas</option>
          <option v-for="area in areaOptions" :key="area" :value="area">
            {{ area }}
          </option>
        </select>

        <select v-model="statusFilter" class="filter-select">
          <option value="">All statuses</option>
          <option v-for="s in statusOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>

        <select v-model.number="minCapacity" class="filter-select">
          <option :value="0">Any size</option>
          <option :value="2">2+ seats</option>
          <option :value="4">4+ seats</option>
          <option :value="6">6+ seats</option>
        </select>
      </div>
    </section>

    <!-- TABLES GRID -->
    <AdminTable
      :columns="tableColumns"
      :rows="filteredTables"
      title="All tables"
      :page-size="12"
      @page-change="onPageChange"
    >
      <!-- Status column pill -->
      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <!-- Actions -->
      <template #cell-actions="{ row }">
        <div class="table-actions">
          <button class="btn-link btn-link--primary" @click="openStatusDialog(row)">Update</button>

          <button v-if="row.currentOrder" class="btn-link" @click="goToOrder(row)">
            View order
          </button>
        </div>
      </template>
    </AdminTable>

    <!-- STATUS UPDATE DIALOG -->
    <div v-if="statusDialogVisible" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">Update table · {{ statusTarget?.name }}</h3>

        <p class="modal-text">
          Current status:
          <strong>{{ statusTarget?.status }}</strong>
        </p>

        <label class="modal-label">
          New status
          <select v-model="statusToUpdate" class="modal-select">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>

        <div class="modal-actions">
          <button class="modal-btn modal-btn--primary" @click="confirmStatusUpdate">Update</button>
          <button class="modal-btn" @click="closeStatusDialog">Cancel</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderPlacesStore } from '@/stores/useOrderPlaceStore'

type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Out of service'

type TableRow = {
  id: number
  name: string
  area: string
  capacity: number
  status: TableStatus
  currentOrder?: number | null
  since: string
  note?: string
}

/* =======================
   Router & Store
======================= */
const router = useRouter()
const orderPlacesStore = useOrderPlacesStore()

onMounted(() => {
  orderPlacesStore.fetchWithCurrentOrders()
})

/* =======================
   Columns
======================= */
const tableColumns: TableColumn[] = [
  { key: 'name', label: 'Table', width: '90px' },
  { key: 'area', label: 'Area / zone' },
  { key: 'capacity', label: 'Seats', width: '70px', align: 'right' },
  { key: 'status', label: 'Status', width: '130px' },
  { key: 'currentOrder', label: 'Order', width: '110px' },
  { key: 'since', label: 'Since', width: '100px' },
  { key: 'note', label: 'Note' },
  { key: 'actions', label: '', width: '150px', align: 'right' },
]

/* =======================
   Map backend → UI rows
======================= */
const tables = computed<TableRow[]>(() =>
  orderPlacesStore.items.map((p) => {
    const activeOrder = p.activeOrders?.[0]
    const occupied = !!activeOrder

    return {
      id: p.id,
      name: p.no,
      area: p.type,
      capacity: p.seat ?? 0,
      status: occupied ? 'Occupied' : p.status === 'ACTIVE' ? 'Available' : 'Out of service',
      currentOrder: activeOrder?.id ?? null,
      since: activeOrder?.createdAt
        ? new Date(activeOrder.createdAt).toTimeString().slice(0, 5)
        : '-',
      note: p.description,
    }
  }),
)

/* =======================
   Filters
======================= */
const search = ref('')
const areaFilter = ref('')
const statusFilter = ref('')
const minCapacity = ref(0)

const areaOptions = computed(() => {
  const set = new Set<string>()
  tables.value.forEach((t) => set.add(t.area))
  return Array.from(set).sort()
})

const statusOptions: TableStatus[] = [
  'Available',
  'Occupied',
  'Reserved',
  'Cleaning',
  'Out of service',
]

const filteredTables = computed(() => {
  const s = search.value.trim().toLowerCase()

  return tables.value.filter((t) => {
    const matchesSearch =
      !s ||
      t.name.toLowerCase().includes(s) ||
      t.area.toLowerCase().includes(s) ||
      (t.note && t.note.toLowerCase().includes(s))

    const matchesArea = !areaFilter.value || t.area === areaFilter.value
    const matchesStatus = !statusFilter.value || t.status === statusFilter.value
    const matchesCapacity = !minCapacity.value || t.capacity >= minCapacity.value

    return matchesSearch && matchesArea && matchesStatus && matchesCapacity
  })
})

/* =======================
   Header counts
======================= */
const availableCount = computed(() => tables.value.filter((t) => t.status === 'Available').length)
const occupiedCount = computed(() => tables.value.filter((t) => t.status === 'Occupied').length)

/* =======================
   Pagination hook
======================= */
function onPageChange(page: number) {
  console.log('Tables page →', page)
}

/* =======================
   Status Dialog (UI only)
======================= */
const statusDialogVisible = ref(false)
const statusTarget = ref<TableRow | null>(null)
const statusToUpdate = ref<TableStatus>('Available')

function openStatusDialog(row: TableRow) {
  statusTarget.value = row
  statusToUpdate.value = row.status
  statusDialogVisible.value = true
}

function closeStatusDialog() {
  statusDialogVisible.value = false
  statusTarget.value = null
}

function confirmStatusUpdate() {
  if (!statusTarget.value) return
  statusTarget.value.status = statusToUpdate.value
  statusDialogVisible.value = false
  // TODO: hook to backend when OrderPlace status update API exists
}

/* =======================
   Status → CSS
======================= */
function statusClass(status: TableStatus) {
  return {
    'status-pill--new': status === 'Available',
    'status-pill--prep': status === 'Reserved' || status === 'Cleaning',
    'status-pill--ready': status === 'Occupied',
    'status-pill--paid': status === 'Out of service',
  }
}

/* =======================
   Go to Order
======================= */
function goToOrder(row: TableRow) {
  router.push({
    name: 'admin-orders',
    query: {
      tableNo: row.name,
    },
  })
}
</script>

<!-- shared filters/status/button styles: same file used by Orders + Menu items -->
<!-- <style src="@/styles/admin/orders-menu-common.css"></style> -->
<!-- page-specific tweaks -->
<style scoped src="@/styles/admin/tables.css"></style>
