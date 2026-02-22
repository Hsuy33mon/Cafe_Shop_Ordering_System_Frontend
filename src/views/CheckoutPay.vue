<template>
  <ScanPayPromptPay v-if="method === 'promptpay'" />
  <PayByCard v-else-if="method === 'card'" />
  <PayByCash v-else-if="method === 'cash'" />
  <div v-else class="cs-container" style="padding: 2rem">Invalid payment method.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ScanPayPromptPay from '../views/ScanPayPromptPay.vue'
import PayByCard from '../views/PayByCard.vue'
import PayByCash from '../views/PayByCash.vue'

const route = useRoute()
const router = useRouter()

const method = computed(() => String(route.params.method || ''))

// Optional guard: if method invalid, go back
if (!['promptpay', 'card', 'cash'].includes(method.value)) {
  router.replace({ name: 'checkoutPaymentMethod' })
}
</script>
