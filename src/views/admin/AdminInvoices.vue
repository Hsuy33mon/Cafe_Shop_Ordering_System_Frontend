<template>
  <main class="content">
    <!-- HEADER + ACTIONS -->
    <section class="panel panel--filters menu-header">
      <div class="menu-header-left">
        <h1 class="menu-title">Invoices</h1>
        <p class="menu-subtitle">Manage all invoices generated in CafeShop.</p>
      </div>

      <button class="menu-btn-primary" @click="goToCreateInvoice">+ Create invoice</button>
    </section>

    <!-- FILTER BAR -->
    <section class="panel panel--filters">
      <div class="filters-row">
        <input v-model="search" type="text" class="search-input" placeholder="Search by invoice no, customer…" />

        <select v-model="statusFilter" class="filter-select">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="CANCELED">Canceled</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select v-model="placeFilter" class="filter-select">
          <option value="">All places</option>
          <option value="TABLE">Table</option>
          <option value="DELIVERY">Delivery</option>
        </select>
      </div>
    </section>

    <!-- INVOICES TABLE -->
    <AdminTable :columns="invoiceColumns" :rows="filteredInvoices" title="All invoices" :page-size="10"
      @page-change="onPageChange">
      <!-- Total -->
      <template #cell-grandTotal="{ value }"> ฿{{ value.toFixed(2) }} </template>

      <template #cell-createdAt="{ value }">
        {{ new Date(value).toLocaleString() }}
      </template>

      <template #cell-paymentMethod="{ value }">
        <span class="payment-pill">
          {{ value }}
        </span>
      </template>

      <!-- Status pill -->
      <template #cell-status="{ value }">
        <span class="status-pill" :class="statusClass(value)">
          {{ value }}
        </span>
      </template>

      <!-- Actions -->
      <template #cell-actions="{ row }">
        <button class="btn-link" @click="viewInvoice(row)">View</button>
        <button class="btn-link btn-link--danger" @click="cancelInvoice(row)">Cancel</button>
      </template>
    </AdminTable>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AdminTable, { type TableColumn } from '@/components/admin/AdminTable.vue'
import { useInvoiceStore } from '@/stores/useInvoiceStore'

const router = useRouter()
const store = useInvoiceStore()
const { invoices } = storeToRefs(store)

onMounted(() => {
  store.fetchAll()
})

const invoiceColumns: TableColumn[] = [
  { key: 'invoiceNo', label: 'Invoice No', width: '160px' },
  { key: 'customerName', label: 'Customer' },
  { key: 'method', label: 'Payment Method' },
  { key: 'orderPlaceName', label: 'Order Place', width: '140px' },
  { key: 'grandTotal', label: 'Total (฿)', align: 'right', width: '120px' },
  { key: 'status', label: 'Status', width: '130px' },
  { key: 'createdAt', label: 'Created At', width: '180px' },
  { key: 'actions', label: 'Actions', align: 'right', width: '150px' },
]

/* Filters */
const search = ref('')
const statusFilter = ref('')
const placeFilter = ref('')

const filteredInvoices = computed(() => {
  const s = search.value.trim().toLowerCase()

  return invoices.value.filter((inv) => {
    const matchesSearch =
      !s || inv.invoiceNo?.toLowerCase().includes(s) || inv.customerName?.toLowerCase().includes(s)

    const matchesStatus = !statusFilter.value || inv.status === statusFilter.value

    const matchesPlace =
      !placeFilter.value || (inv.orderPlaceName || '').toUpperCase().includes(placeFilter.value)

    return matchesSearch && matchesStatus && matchesPlace
  })
})

function viewInvoice(row: any) {
  router.push({
    name: 'admin-invoice-detail',
    params: { id: row.id },
  })
}

function cancelInvoice(row: any) {
  console.log('Cancel invoice', row.id)
}

function statusClass(status: string) {
  return {
    'status-pill--new': status === 'PAID',
    'status-pill--prep': status === 'PENDING',
    'status-pill--ready': status === 'CANCELED',
    'status-pill--cancel': status === 'REFUNDED',
  }
}

function goToCreateInvoice() {
  router.push({ name: 'admin-invoice-new' })
}

</script>

<style scoped src="@/styles/admin/admin-invoices.css"></style>
