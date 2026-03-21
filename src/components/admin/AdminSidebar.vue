<!-- src/components/admin/AdminSidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">☕</div>
      <div class="logo-text">
        <span class="logo-main">5:1 Cafe</span>
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
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDashboardStore } from '../../stores/useDashboardStore'

const dashboardStore = useDashboardStore()
type SidebarItem = {
  key: string
  label: string
  icon: string
}

defineProps<{
  sidebarItems: SidebarItem[]
}>()

const todaySummary = computed(() => {
  const d = dashboardStore.dashboard

  if (!d) return 'Loading...'

  return `${d.todayOrders} orders · ฿${d.todayProfitBaht.toLocaleString()} revenue`
})
</script>

<style scoped src="@/styles/admin/sidebar.css"></style>
