<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ReviewModal from '@/components/layout/ReviewModal.vue'

const route = useRoute()

const showReviewModal = ref(false)
const invoiceNo = String(route.query.invoiceNo)
const customerName = 'Felix' // get from store later

onMounted(() => {
  // Auto popup review after payment success
  showReviewModal.value = true
})
</script>

<template>
  <div class="success-page">
    <h1>🎉 Payment Successful!</h1>
    <p>Your order has been completed.</p>

<ReviewModal
      v-if="showReviewModal"
      :invoiceNo="invoiceNo"
      :customerName="customerName"
      @close="showReviewModal = false"
    />
  </div>
</template>
