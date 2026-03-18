<template>
  <div class="login-page">
    <form class="card" @submit.prevent="onSubmit">
      <h1>Admin Login</h1>

      <label>Email</label>
      <input v-model.trim="form.email" type="email" placeholder="example.com" required />

      <label>Password</label>
      <input v-model="form.password" type="password" placeholder="Secr123" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const loading = computed(() => auth.loading)
const error = computed(() => auth.error)

async function onSubmit() {
  try {
    await auth.login(form)
    router.push('/admin')
  } catch {}
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  display: grid;
  gap: 10px;
}
input {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  outline: none;
}
button {
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.error {
  color: #b91c1c;
  margin: 0;
}
</style>
