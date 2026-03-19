<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters tables-header">
      <div class="tables-header-left">
        <h1 class="tables-title">Tables</h1>
        <p class="tables-subtitle">Live overview of cafe tables, rooms and their current status.</p>
      </div>

      <div class="tables-header-right">
        <span class="tables-pill tables-pill--free">{{ activeCount }} active</span>
        <span class="tables-pill tables-pill--occupied">{{ inactiveCount }} inactive</span>
        <button class="menu-btn-primary" @click="openCreateDialog">Add new table</button>
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
      :page-size="20"
      @page-change="onPageChange"
    >
      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="table-actions">
          <button class="btn-link btn-link--primary" @click="openEditDialog(row)">Update</button>
          <button v-if="row.currentOrder" class="btn-link" @click="goToOrder(row)">
            View order
          </button>
        </div>
      </template>
    </AdminTable>

    <!-- CREATE TABLE DIALOG -->
    <div v-if="createDialogVisible" class="modal-backdrop">
      <div class="modal modal--wide">
        <h3 class="modal-title">Add new table</h3>

        <label class="modal-label">
          Table number
          <input v-model="createForm.name" class="modal-input" placeholder="Eg. T1" />
        </label>

        <label class="modal-label">
          Area / zone
          <input v-model="createForm.area" class="modal-input" placeholder="Eg. Garden" />
        </label>

        <label class="modal-label">
          Seats
          <input
            v-model.number="createForm.capacity"
            type="number"
            min="1"
            class="modal-input"
            placeholder="Eg. 4"
          />
        </label>

        <label class="modal-label">
          Status
          <select v-model="createForm.status" class="modal-select">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>

        <label class="modal-label">
          Note
          <textarea
            v-model="createForm.note"
            rows="3"
            class="modal-textarea"
            placeholder="Optional note for staff"
          />
        </label>

        <div class="modal-actions">
          <button class="modal-btn modal-btn--primary" @click="confirmCreate">Create</button>
          <button class="modal-btn" @click="closeCreateDialog">Cancel</button>
        </div>
      </div>
    </div>

    <!-- EDIT TABLE DIALOG -->
    <div v-if="editDialogVisible" class="modal-backdrop">
      <div class="modal modal--wide">
        <h3 class="modal-title">Update table</h3>

        <label class="modal-label">
          Table number
          <input v-model="editForm!.name" class="modal-input" />
        </label>

        <label class="modal-label">
          Area / zone
          <input v-model="editForm!.area" class="modal-input" />
        </label>

        <label class="modal-label">
          Seats
          <input
            v-model.number="editForm!.capacity"
            type="number"
            min="1"
            class="modal-input"
          />
        </label>

        <label class="modal-label">
          Status
          <select v-model="editForm!.status" class="modal-select">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>

        <label class="modal-label">
          Note
          <textarea
            v-model="editForm!.note"
            rows="3"
            class="modal-textarea"
            placeholder="Optional note for staff"
          />
        </label>

        <div class="modal-actions">
          <button class="modal-btn modal-btn--primary" @click="confirmEdit">Save changes</button>
          <button class="modal-btn" @click="closeEditDialog">Cancel</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderPlacesStore, type OrderPlaceStatus } from '@/stores/useOrderPlaceStore'

type TableStatus = 'Active' | 'Inactive'
const statusOptions: TableStatus[] = ['Active', 'Inactive']

type TableEditForm = {
  id: number
  name: string
  area: string
  capacity: number
  status: TableStatus
  note?: string
}

type TableCreateForm = {
  name: string
  area: string
  capacity: number
  status: TableStatus
  note?: string
}

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
   Create dialog
======================= */
const createDialogVisible = ref(false)

const createForm = ref<TableCreateForm>({
  name: '',
  area: '',
  capacity: 1,
  status: 'Active',
  note: '',
})

function resetCreateForm() {
  createForm.value = {
    name: '',
    area: '',
    capacity: 1,
    status: 'Active',
    note: '',
  }
}

function openCreateDialog() {
  resetCreateForm()
  createDialogVisible.value = true
}

function closeCreateDialog() {
  createDialogVisible.value = false
}

function toApiStatus(status: TableStatus): OrderPlaceStatus {
  return status === 'Active' ? 'ACTIVE' : 'INACTIVE'
}

async function confirmCreate() {
  try {
    await orderPlacesStore.createOrderPlace({
      no: createForm.value.name,
      type: createForm.value.area,
      seat: createForm.value.capacity,
      status: toApiStatus(createForm.value.status),
      description: createForm.value.note,
    })

    createDialogVisible.value = false
    await orderPlacesStore.fetchWithCurrentOrders()
  } catch (e) {
    alert(orderPlacesStore.error || 'Create failed')
  }
}

/* =======================
   Edit dialog
======================= */
const editDialogVisible = ref(false)
const editForm = ref<TableEditForm | null>(null)

function openEditDialog(row: TableRow) {
  editForm.value = {
    id: row.id,
    name: row.name,
    area: row.area,
    capacity: row.capacity,
    status: row.status,
    note: row.note ?? '',
  }
  editDialogVisible.value = true
}

function closeEditDialog() {
  editDialogVisible.value = false
  editForm.value = null
}

async function confirmEdit() {
  if (!editForm.value) return

  try {
    await orderPlacesStore.updateOrderPlace(editForm.value.id, {
      no: editForm.value.name,
      type: editForm.value.area,
      seat: editForm.value.capacity,
      status: toApiStatus(editForm.value.status),
      description: editForm.value.note,
    })

    editDialogVisible.value = false
    await orderPlacesStore.fetchWithCurrentOrders()
  } catch (e) {
    alert(orderPlacesStore.error || 'Update failed')
  }
}

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
  orderPlacesStore.items
    .filter((p) => p.status !== 'DELETED')
    .map((p) => ({
      id: p.id,
      name: p.no,
      area: p.type,
      capacity: p.seat ?? 0,
      status: p.status === 'ACTIVE' ? 'Active' : 'Inactive',
      currentOrder: p.activeOrders?.[0]?.id ?? null,
      since: p.activeOrders?.[0]?.createdAt
        ? new Date(p.activeOrders[0].createdAt).toTimeString().slice(0, 5)
        : '-',
      note: p.description,
    })),
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
const activeCount = computed(() => tables.value.filter((t) => t.status === 'Active').length)
const inactiveCount = computed(() => tables.value.filter((t) => t.status === 'Inactive').length)

/* =======================
   Pagination hook
======================= */
function onPageChange(page: number) {
  console.log('Tables page →', page)
}

/* =======================
   Status → CSS
======================= */
function statusClass(status: TableStatus) {
  return {
    'status-pill--active': status === 'Active',
    'status-pill--inactive': status === 'Inactive',
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

<style scoped src="@/styles/admin/tables.css"></style>