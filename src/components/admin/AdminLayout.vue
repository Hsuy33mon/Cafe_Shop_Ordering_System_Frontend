<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-page">
    <AdminSidebar
      :sidebar-items="sidebarItems"
      :active-menu="activeMenu"
      :today-summary="todaySummary"
      @update:active-menu="activeMenu = $event"
    />

    <div class="admin-main">
      <AdminTopbar v-model:search="search" />

      <main class="content">
        <!-- Here we render admin pages like Dashboard, Orders, etc -->
        <RouterView :search="search" />
      </main>

      <AdminFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import AdminFooter from '@/components/admin/AdminFooter.vue'

type SidebarItem = {
  key: string
  label: string
  icon: string
}

const sidebarItems: SidebarItem[] = [
  { key: 'admin-dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'admin-orders', label: 'Orders', icon: '🧾' },
  { key: 'admin-menu', label: 'Menu items', icon: '🍽' },
  { key: 'admin-tables', label: 'Tables', icon: '🪑' },
  { key: 'admin-customers', label: 'Customers', icon: '👥' },
  { key: 'admin-settings', label: 'Settings', icon: '⚙️' },
]

const activeMenu = ref('admin-dashboard')
const search = ref('')
const todaySummary = '128 orders · ฿18,420 revenue'
</script>
