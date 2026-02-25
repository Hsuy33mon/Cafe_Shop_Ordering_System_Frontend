<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps<{
  invoiceNo: string
  customerName: string
}>()

const emit = defineEmits(['close'])

const rating = ref(5)
const comment = ref('')
const loading = ref(false)

async function submitReview() {
  try {
    loading.value = true

    await axios.post('http://localhost:8080/api/reviews', {
      invoiceNo: props.invoiceNo,
      customerName: props.customerName,
      rating: rating.value,
      comment: comment.value
    })

    emit('close')

  } catch (err) {
    console.error(err)
    alert('Failed to submit review.')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <h2>Rate Your Order</h2>

      <div class="stars">
        <span
          v-for="n in 5"
          :key="n"
          @click="rating = n"
          :class="{ active: n <= rating }"
        >
          ★
        </span>
      </div>

      <textarea
        v-model="comment"
        placeholder="Write your review..."
      ></textarea>

      <button @click="submitReview">
        Submit Review
      </button>
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 400px;
}

.stars span {
  font-size: 28px;
  cursor: pointer;
  color: #ccc;
}

.stars span.active {
  color: #f59e0b;
}
</style>
