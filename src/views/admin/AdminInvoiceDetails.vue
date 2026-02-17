<template>
  <main class="content" v-if="invoice">
    <!-- TOP NAV -->
<div class="top-nav">
  <button class="back-btn" @click="goBack">
    ← Back to Invoices
  </button>
</div>

    <!-- HEADER -->
    <section class="invoice-header">
      <div>
        <h1 class="invoice-title">Invoice #{{ invoice.id }}</h1>
<div class="invoice-subtitle">{{ invoice.customerName }}</div>

      </div>

      <span class="status-pill status-pill--pending">
        {{ invoice.status }}
      </span>
    </section>

    <!-- INVOICE INFO -->
<section class="panel invoice-card">
  <div class="card-title">Invoice Info</div>

  <div class="info-table-wrapper">
    <table class="info-table">
      <tbody>
        <tr>
          <td class="label">Customer</td>
          <td class="value">{{ invoice.customerName }}</td>

          <!-- <td class="label">Order Place</td>
          <td class="value">{{ invoice.orderPlace }}</td> -->
        </tr>

        <tr>
          <td class="label">Invoice No.</td>
          <td class="value">{{ invoice.invoiceNo || '-' }}</td>

          <td class="label">Status</td>
          <td class="value">
            <span class="status-pill status-pill--pending">
              {{ invoice.status }}
            </span>
          </td>
        </tr>

        <tr>
          <td class="label">Created at</td>
          <td class="value">{{ formatDate(invoice.createdAt) }}</td>

          <td class="label">Tax</td>
          <td class="value">฿{{ invoice.tax.toFixed(2) }}</td>
        </tr>

        <tr>
          <td class="label">Applied at</td>
          <td class="value">{{ formatDate(invoice.appliedAt) }}</td>d>

          <td class="label">Delivery Fee</td>
          <td class="value">฿{{ invoice.deliveryFee.toFixed(2) }}</td>
        </tr>

        <tr class="summary-row">
          <td></td>
          <td></td>

          <td class="label strong">Subtotal</td>
          <td class="value strong">฿{{ invoice.subTotal.toFixed(2) }}</td>
        </tr>

        <tr class="grand-row">
          <td></td>
          <td></td>

          <td class="label strong">Grand Total</td>
          <td class="value strong">฿{{ invoice.grandTotal.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


    <!-- ITEMS -->
    <section class="panel invoice-card">
      <div class="card-title">Items</div>

      <div class="inner-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Menu Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Line Total</th>
              <th>Note</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in invoice.orders" :key="item.id">

              <td>{{ index + 1 }}</td>
              <td>
                <div class="item-name">{{ item.menuItemName }} ({{ item.sizeName  }})</div>
              </td>
              <td>{{ item.qty }}</td>
              <td>฿{{ item.unitPrice.toFixed(2) }}</td>
              <td>฿{{item.lineTotal.toFixed(2) }}</td>
              <td>{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- PAYMENTS -->
    <section class="panel invoice-card">
      <div class="card-title">Payments</div>

      <div class="inner-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Method</th>
              <th>Gateway</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Ref #</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(p) in invoice.payments" :key="p.id">
              <td>1</td>
              <td>{{  p.method }}</td>
              <td>{{ p.gateway }}</td>
              <td>฿{{ p.amount.toFixed(2) }}</td>
              <td>
                <span class="status-pill status-pill--pending">
                  {{ p.status  }}
                </span>
              </td>
              <td>{{  p.referenceNo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- FOOTER -->
    <section class="footer-actions">
      <div>
        <button class="btn-secondary">Edit</button>
        <button class="btn-danger">Cancel Invoice</button>
      </div>
    </section>

  </main>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from '@/stores/useInvoiceStore'

const router = useRouter()
const route = useRoute()

const store = useInvoiceStore()
const { currentInvoice: invoice, loading, error } = storeToRefs(store)

onMounted(() => {
  store.fetchById(Number(route.params.id))
})

function goBack() {
  router.push({ name: 'admin-invoices' })
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}
</script>


<style scoped src="@/styles/admin/admin-invoice-detail.css"></style>
