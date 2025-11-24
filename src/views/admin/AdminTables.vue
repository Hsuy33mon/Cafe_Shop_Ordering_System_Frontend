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
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'

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

const router = useRouter()

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

// --- dummy data: later replace via API ---
const tables = ref<TableRow[]>([
  {
    id: 1,
    name: 'T01',
    area: 'Cafe – Window',
    capacity: 2,
    status: 'Occupied',
    currentOrder: 1050,
    since: '11:20',
    note: 'Couple · long stay',
  },
  {
    id: 2,
    name: 'T02',
    area: 'Cafe – Window',
    capacity: 2,
    status: 'Available',
    currentOrder: null,
    since: '10:45',
  },
  {
    id: 3,
    name: 'T03',
    area: 'Cafe – Center',
    capacity: 4,
    status: 'Reserved',
    currentOrder: null,
    since: '12:00',
    note: 'Birthday 12:30',
  },
  {
    id: 4,
    name: 'T04',
    area: 'Cafe – Center',
    capacity: 4,
    status: 'Occupied',
    currentOrder: 1049,
    since: '11:10',
  },
  {
    id: 5,
    name: 'T05',
    area: 'Terrace',
    capacity: 4,
    status: 'Cleaning',
    currentOrder: null,
    since: '11:05',
  },
  {
    id: 6,
    name: 'T06',
    area: 'Terrace',
    capacity: 2,
    status: 'Available',
    currentOrder: null,
    since: '10:15',
  },
  {
    id: 7,
    name: 'Room 1205',
    area: 'Hotel – Floor 12',
    capacity: 2,
    status: 'Occupied',
    currentOrder: 1051,
    since: '11:25',
    note: 'Room service',
  },
  {
    id: 8,
    name: 'Room 907',
    area: 'Hotel – Floor 9',
    capacity: 2,
    status: 'Available',
    currentOrder: null,
    since: '09:30',
  },
  {
    id: 9,
    name: 'T07',
    area: 'Cafe – Bar',
    capacity: 1,
    status: 'Out of service',
    currentOrder: null,
    since: 'Yesterday',
    note: 'Broken chair',
  },
])

// --- filters ---
const search = ref('')
const areaFilter = ref<string>('')
const statusFilter = ref<string>('')
const minCapacity = ref<number>(0)

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

// counts for header pills
const availableCount = computed(() => tables.value.filter((t) => t.status === 'Available').length)
const occupiedCount = computed(() => tables.value.filter((t) => t.status === 'Occupied').length)

// page-change hook (for analytics / later API pagination)
function onPageChange(page: number) {
  console.log('Tables page →', page)
}

// --- status dialog logic ---
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
  // TODO: call API in real app
}

// status → css class
function statusClass(status: TableStatus) {
  return {
    'status-pill--new': status === 'Available',
    'status-pill--prep': status === 'Reserved' || status === 'Cleaning',
    'status-pill--ready': status === 'Occupied',
    'status-pill--paid': status === 'Out of service',
  }
}

// navigate to order (if you have admin order route)
function goToOrder(row: TableRow) {
  if (!row.currentOrder) return
  router.push({
    name: 'admin-orders' /* or order details route */,
    query: { focus: row.currentOrder },
  })
}
</script>

<!-- shared filters/status/button styles: same file used by Orders + Menu items -->
<!-- <style src="@/styles/admin/orders-menu-common.css"></style> -->
<!-- page-specific tweaks -->
<style scoped src="@/styles/admin/tables.css"></style>
