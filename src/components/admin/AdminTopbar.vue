<!-- src/components/admin/AdminTopbar.vue -->
<template>
  <header class="topbar">
    <div class="topbar-left">
      <!-- HAMBURGER: visible only on tablet/mobile by CSS -->
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
const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'toggle-sidebar'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:search', target.value)
}
</script>
<style scoped src="@/styles/admin/topbar.css"></style>
