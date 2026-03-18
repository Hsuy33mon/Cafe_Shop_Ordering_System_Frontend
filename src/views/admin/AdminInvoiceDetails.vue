<template>
  <main class="content" v-if="invoice">
    <!-- TOP NAV -->
    <div class="top-nav">
      <button class="back-btn" @click="goBack">← Back to Invoices</button>
    </div>

    <section class="invoice-header">
      <div>
        <h1 class="invoice-title">Invoice #{{ invoice.id }}</h1>
        <div class="invoice-subtitle">{{ invoice.customerName }}</div>
      </div>

      <div class="header-actions">
        <button class="btn-secondary" :disabled="printing.invoice" @click="printInvoice">
          {{ printing.invoice ? 'Printing...' : 'Print Invoice' }}
        </button>

        <span class="status-pill status-pill--pending">
          {{ invoice.status }}
        </span>
      </div>
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
              <td class="value">{{ formatDate(invoice.appliedAt) }}</td>
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
        <table class="items-table">
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
                <div class="item-name">{{ item.menuItemName }} ({{ item.sizeName }})</div>

                <div v-if="item.ingredientResponses?.length" class="ingredient-list">
                  <div
                    v-for="ingredient in item.ingredientResponses"
                    :key="ingredient.id"
                    class="ingredient-row"
                  >
                    • {{ ingredient.name }}
                    <span v-if="ingredient.qty"> x{{ ingredient.qty }}</span>
                    <span v-if="ingredient.price != null">
                      — ฿{{ (Number(ingredient.price) * Number(ingredient.qty || 1)).toFixed(2) }}
                    </span>
                    <span v-if="ingredient.note"> ({{ ingredient.note }}) </span>
                  </div>
                </div>

                <div v-else class="ingredient-empty">-</div>
              </td>

              <td>{{ item.qty }}</td>
              <td>฿{{ Number(item.unitPrice).toFixed(2) }}</td>
              <td>฿{{ getOrderDisplayTotal(item).toFixed(2) }}</td>
              <td>{{ item.note || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- PAYMENTS -->
    <section class="panel invoice-card">
      <div class="card-title">Payments</div>

      <div class="inner-table">
        <table class="payments-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Method</th>
              <th>Gateway</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Ref #</th>
              <th>QR</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(p, index) in invoice.payments" :key="p.id">
              <td>{{ index + 1 }}</td>
              <td>{{ p.method }}</td>
              <td>{{ p.gateway }}</td>
              <td>฿{{ p.amount.toFixed(2) }}</td>
              <td>
                <div class="pay-status-cell">
                  <select class="status-select" v-model="editStatus[p.id]" :disabled="saving[p.id]">
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>

                  <button
                    class="btn-small"
                    :disabled="saving[p.id] || editStatus[p.id] === p.status"
                    @click="updatePaymentStatus(p.id)"
                  >
                    {{ saving[p.id] ? 'Saving...' : 'Update' }}
                  </button>
                </div>

                <div v-if="errorMsg[p.id]" class="error-text">
                  {{ errorMsg[p.id] }}
                </div>
              </td>
              <td>{{ p.referenceNo }}</td>
              <td>
                <a :href="p.qrImageUrl" target="_blank">
                  <img :src="p.qrImageUrl" class="qr-image" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { onMounted, computed, reactive, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from '@/stores/useInvoiceStore'
import { usePaymentStore } from '@/stores/usePaymentStore'
import { printDirectThermalReceipt, type ReceiptData, type ReceiptItem } from '@/lib/thermalPrint'

const router = useRouter()
const route = useRoute()

const store = useInvoiceStore()
const paymentStore = usePaymentStore()
const { currentInvoice: invoice } = storeToRefs(store)

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

function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function getIngredientTotal(item: any): number {
  if (!item?.ingredientResponses?.length) return 0

  return item.ingredientResponses.reduce((sum: number, ing: any) => {
    return sum + num(ing.price) * num(ing.qty || 1)
  }, 0)
}

function getOrderDisplayTotal(item: any): number {
  return num(item.lineTotal) + getIngredientTotal(item)
}

const computedSubTotal = computed(() => {
  if (!invoice.value?.orders?.length) return 0

  return invoice.value.orders.reduce((sum: number, item: any) => {
    return sum + getOrderDisplayTotal(item)
  }, 0)
})

const computedGrandTotal = computed(() => {
  return computedSubTotal.value + num(invoice.value?.tax) + num(invoice.value?.deliveryFee)
})

function buildReceiptData(invoice: any): ReceiptData {
  const items: ReceiptItem[] = (invoice?.orders || []).map((item: any) => {
    const ingredients = (item.ingredientResponses || []).map((ing: any) => ({
      name: ing.name,
      qty: num(ing.qty || 1),
      price: num(ing.price),
    }))

    const ingredientPrice = ingredients.reduce((sum: number, ing: any) => {
      return sum + num(ing.price) * num(ing.qty)
    }, 0)

    const qty = num(item.qty || 1)
    const lineTotal = num(item.lineTotal)
    const unitBasePrice = qty > 0 ? lineTotal / qty : num(item.unitPrice)
    const totalUnitPrice = qty > 0 ? (lineTotal + ingredientPrice) / qty : num(item.unitPrice)

    return {
      name: `${item.menuItemName}${item.sizeName ? ` (${item.sizeName})` : ''}`,
      qty,
      basePrice: unitBasePrice,
      ingredientPrice,
      price: totalUnitPrice,
      ingredients,
    }
  })

  const subtotal = items.reduce((sum, item) => sum + num(item.basePrice) * num(item.qty), 0)
  const ingredientTotal = items.reduce((sum, item) => sum + num(item.ingredientPrice), 0)
  const total = subtotal + ingredientTotal + num(invoice?.tax) + num(invoice?.deliveryFee)

  return {
    shopName: 'CafeShop',
    address: 'Your shop address',
    phone: 'Your shop phone',
    orderNo: invoice?.invoiceNo || invoice?.id,
    customerName: invoice?.customerName || '-',
    orderType: invoice?.type || '',
    place: invoice?.orderPlaceName || invoice?.no || '',
    method: invoice?.payments?.[0]?.method || '',
    status: invoice?.status || '',
    items,
    subtotal,
    ingredientTotal,
    total,
  }
}

const printing = reactive<{ invoice: boolean }>({
  invoice: false,
})

// per-payment edit status map
const editStatus = reactive<Record<number, string>>({})
const saving = reactive<Record<number, boolean>>({})
const errorMsg = reactive<Record<number, string>>({})

watchEffect(() => {
  if (!invoice.value?.payments) return
  for (const p of invoice.value.payments) {
    if (editStatus[p.id] == null) editStatus[p.id] = p.status
  }
})

async function updatePaymentStatus(paymentId: number) {
  try {
    saving[paymentId] = true
    errorMsg[paymentId] = ''
    const newStatus = editStatus[paymentId]

    await paymentStore.updatePaymentStatus({ paymentId, status: newStatus })
    await store.fetchById(Number(route.params.id))
  } catch (e: any) {
    errorMsg[paymentId] =
      e?.response?.data?.message || e?.message || 'Failed to update payment status'
  } finally {
    saving[paymentId] = false
  }
}

async function printInvoice() {
  try {
    if (!invoice.value) {
      alert('Invoice data not found')
      return
    }

    const printerName = localStorage.getItem('printerName') || 'ZN- ZN58U'

    if (!printerName) {
      alert('Printer is not selected')
      return
    }

    printing.invoice = true

    const receiptData = buildReceiptData(invoice.value)
    await printDirectThermalReceipt(printerName, receiptData)
  } catch (e: any) {
    console.error('Print invoice failed:', e)
    alert(e?.message || 'Failed to print invoice')
  } finally {
    printing.invoice = false
  }
}
</script>

<style scoped src="@/styles/admin/admin-invoice-detail.css"></style>
