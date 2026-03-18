<template>
  <button @click="handleDirectPrint">Print Receipt</button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/useCartStore'
import { usePaymentStore } from '@/stores/usePaymentStore'
import { useOrderSessionStore } from '@/stores/orderSession'
import { printDirectThermalReceipt } from '@/lib/thermalPrint'

const cartStore = useCartStore()
const paymentStore = usePaymentStore()
const session = useOrderSessionStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const ingredientTotal = computed(() => cartStore.totalIngredientPrice)
const total = computed(() => subtotal.value + ingredientTotal.value)
const payment = computed(() => paymentStore.payment)

async function handleDirectPrint() {
  try {
    await printDirectThermalReceipt('ZN- ZN58U', {
      shopName: 'Cafe Shop',
      address: 'Patong Beach, Phuket',
      phone: '089-123-4567',
      orderNo: payment.value?.invoiceId || payment.value?.id || '-',
      customerName: session.customerName || 'Walk-in',
      orderType: session.orderType || 'TABLE',
      place: session.placeNumber ? `T-${session.placeNumber}` : '-',
      method: payment.value?.paymentType || 'CASH',
      status: payment.value?.status || 'PENDING',
      items: items.value.map((it) => ({
        name: it.name,
        qty: it.quantity,
        price: it.unitPrice,
      })),
      subtotal: subtotal.value + ingredientTotal.value,
      total: total.value,
    })
  } catch (e) {
    console.error('Direct print failed', e)
    alert('Direct print failed. Please check QZ Tray and printer name.')
  }
}
</script>
