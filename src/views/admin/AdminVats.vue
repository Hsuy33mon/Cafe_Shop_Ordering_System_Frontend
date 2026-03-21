<template>
  <main class="content">
    <!-- HEADER -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">VAT Settings</h1>
        <p class="menu-subtitle">Manage VAT configurations for CafeShop.</p>
      </div>

      <button class="menu-btn-primary" @click="goToCreateVat">+ Add VAT</button>
    </section>

    <!-- FILTER -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by code or name…"
        />

        <select v-model="statusFilter" class="filter-select">
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </section>

    <!-- TABLE -->
    <AdminTable :columns="vatColumns" :rows="filteredVats" title="All VAT" :page-size="10">
      <!-- Rate -->
      <template #cell-vatRate="{ value }"> {{ value }}% </template>

      <!-- Type -->
      <template #cell-taxType="{ value }">
        <span class="status-pill">
          {{ value }}
        </span>
      </template>

      <!-- Active -->
      <template #cell-isActive="{ value }">
        <span class="status-pill" :class="value ? 'status-pill--new' : 'status-pill--cancel'">
          {{ value ? 'Active' : 'Inactive' }}
        </span>
      </template>

      <!-- Default -->
      <template #cell-isDefault="{ value }">
        <span v-if="value" class="status-pill status-pill--ready"> Default </span>
      </template>

      <!-- Created -->
      <template #cell-createdAt="{ value }">
        {{ new Date(value).toLocaleString() }}
      </template>

      <!-- Actions -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="editVat(row)">Edit</button>
        <button class="btn-link btn-link--danger" @click="deleteVat(row)">Delete</button>
      </template>
    </AdminTable>
  </main>
  <!-- VAT MODAL -->
  <div v-if="showModal" class="modal-backdrop">
    <div class="modal">
      <h2>{{ isEditMode ? 'Update VAT' : 'Create VAT' }}</h2>

      <input v-model="form.vatCode" type="text" placeholder="VAT Code" class="modal-input" />
      <input v-model="form.vatName" type="text" placeholder="VAT Name" class="modal-input" />

      <select v-model="form.taxType" class="modal-input">
        <option value="PERCENTAGE">Percentage (%)</option>
        <option value="FIXED">Fixed (฿)</option>
      </select>

      <input v-model.number="form.vatRate" type="number" placeholder="Rate" class="modal-input" />

      <label class="modal-checkbox">
        <input type="checkbox" v-model="form.isActive" />
        Active
      </label>

      <label class="modal-checkbox">
        <input type="checkbox" v-model="form.isDefault" />
        Default VAT
      </label>

      <div class="modal-actions">
        <button class="btn-link btn-link--danger" @click="closeModal">Cancel</button>

        <button class="menu-btn-primary" @click="saveVat">
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { useVatStore } from '@/stores/useVatStore'

const store = useVatStore()
const { vats } = storeToRefs(store)
const showModal = ref(false)
const isEditMode = ref(false)
const selectedVat = ref<any>(null)

const form = ref({
  vatCode: '',
  vatName: '',
  taxType: 'PERCENTAGE',
  vatRate: 0,
  isActive: true,
  isDefault: false,
})
onMounted(() => {
  store.fetchAll()
})

/* TABLE COLUMNS */
const vatColumns: TableColumn[] = [
  { key: 'vatCode', label: 'Code', width: '120px' },
  { key: 'vatName', label: 'Name' },
  { key: 'taxType', label: 'Type', width: '120px' },
  { key: 'vatRate', label: 'Rate', width: '100px', align: 'right' },
  { key: 'isActive', label: 'Status', width: '120px' },
  { key: 'isDefault', label: 'Default', width: '120px' },
  { key: 'createdAt', label: 'Created At', width: '180px' },
  { key: 'actions', label: 'Actions', width: '140px', align: 'right' },
]

/* FILTERS */
const search = ref('')
const statusFilter = ref('')

const filteredVats = computed(() => {
  const s = search.value.toLowerCase()

  return vats.value.filter((v) => {
    const matchesSearch =
      !s || v.vatCode?.toLowerCase().includes(s) || v.vatName?.toLowerCase().includes(s)

    const matchesStatus = !statusFilter.value || String(v.isActive) === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

/* ACTIONS */
function deleteVat(row: any) {
  store.deleteVat(row.id)
}

async function saveVat() {
  if (isEditMode.value) {
    await store.updateVat(selectedVat.value.id, form.value)
  } else {
    await store.createVat(form.value)
  }

  showModal.value = false
}
function closeModal() {
  showModal.value = false
  isEditMode.value = false
  selectedVat.value = null

  form.value = {
    vatCode: '',
    vatName: '',
    taxType: 'PERCENTAGE',
    vatRate: 0,
    isActive: true,
    isDefault: false,
  }
}

function goToCreateVat() {
  isEditMode.value = false
  selectedVat.value = null
  showModal.value = true
}

function editVat(row: any) {
  isEditMode.value = true
  selectedVat.value = row

  form.value = {
    vatCode: row.vatCode,
    vatName: row.vatName,
    taxType: row.taxType,
    vatRate: row.vatRate,

    // ✅ FIX HERE
    isActive: row.isActive ?? row.active,
    isDefault: row.isDefault ?? row.default,
  }

  showModal.value = true
}

// function editVat(row: any) {
//   isEditMode.value = true
//   selectedVat.value = row

//   form.value = {
//     vatCode: row.vatCode,
//     vatName: row.vatName,
//     taxType: row.taxType,
//     vatRate: row.vatRate,
//     isActive: row.isActive,
//     isDefault: row.isDefault,
//   }

//   showModal.value = true
// }
</script>
<style scoped src="@/styles/admin/menu-items.css"></style>

<!-- <style scoped src="@/styles/admin/admin-invoices.css"></style> -->
