<!-- src/components/admin/AdminSidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">☕</div>
      <div class="logo-text">
        <span class="logo-main">CafeShop</span>
        <span class="logo-sub">Admin</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in sidebarItems"
        :key="item.label"
        :to="{ name: item.key }"
        class="sidebar-link"
        :class="{ 'sidebar-link--active': $route.name === item.key }"
      >
        <span class="sidebar-link-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <p class="sidebar-status-label">Today</p>
      <p class="sidebar-status-value">{{ todaySummary }}</p>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'

type SidebarItem = {
  key: string
  label: string
  icon: string
}

defineProps<{
  sidebarItems: SidebarItem[]
  todaySummary: string
}>()

const route = useRoute()
</script>

<style scoped src="@/styles/admin/sidebar.css"></style>
