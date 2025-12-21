<!-- src/components/admin/AdminTopbar.vue -->
<template>
  <header class="topbar">
    <div class="topbar-left">
      <!-- HAMBURGER -->
      <button class="topbar-menu-btn" @click="$emit('toggle-sidebar')" aria-label="Open menu">
        ☰
      </button>

      <div class="topbar-text">
        <h1 class="topbar-title">Dashboard</h1>
        <p class="topbar-subtitle">Overview of today’s activity at CafeShop.</p>
      </div>
    </div>

    <div class="topbar-right">
      <div class="topbar-search">
        <span class="search-icon">🔍</span>
        <input
          :value="search"
          type="text"
          class="search-input"
          placeholder="Search orders, customers…"
          @input="onInput"
        />
      </div>

      <!-- ✅ LOGOUT MENU BUTTON (no dropdown) -->
      <button class="topbar-action-btn" type="button" @click="logout" aria-label="Logout">
        Logout
      </button>

      <div class="topbar-user">
        <div class="user-initial">M</div>
        <div class="user-meta">
          <span class="user-name">Manager</span>
          <span class="user-role">Cafe admin</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

defineProps<{
  search: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'toggle-sidebar'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:search', target.value)
}

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<style scoped src="@/styles/admin/topbar.css"></style>

<style scoped>
.topbar-action-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  line-height: 1;
}

.topbar-action-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}
</style>
