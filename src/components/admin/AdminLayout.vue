<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-page">
    <!-- SIDEBAR -->
    <AdminSidebar
      :sidebar-items="sidebarItems"
      :active-menu="activeMenu"
      :today-summary="todaySummary"
      :class="{ 'sidebar--open': isSidebarOpen }"
      @update:active-menu="activeMenu = $event"
    />

    <!-- BACKDROP (for tablet/mobile) -->
    <div v-if="isSidebarOpen" class="sidebar-backdrop" @click="isSidebarOpen = false"></div>

    <!-- MAIN AREA -->
    <div class="admin-main">
      <AdminTopbar v-model:search="search" @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="content">
        <!-- Here we render admin pages like Dashboard, Orders, etc -->
        <RouterView :search="search" />
      </main>

      <!-- keep footer exactly as you had -->
      <AdminFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminFooter from '@/components/admin/AdminFooter.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { ref } from 'vue'

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
  { key: 'admin-invoices', label: 'Invoices', icon: '📝' },
  { key: 'admin-settings', label: 'Settings', icon: '⚙️' },
]

const activeMenu = ref('admin-dashboard')
const search = ref('')
const todaySummary = '128 orders · ฿18,420 revenue'

const isSidebarOpen = ref(false)
</script>

<style>
/* basic layout, footer untouched */
.admin-page {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* dark overlay when sidebar is open on small screens */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 39;
}

@media (min-width: 1025px) {
  .sidebar-backdrop {
    display: none;
  }
}
@media (max-width: 1024px) {
  .admin-main {
    width: 100%;
    margin-left: 0 !important;
  }

  .content {
    max-width: 100% !important;
    width: 100% !important;
    padding: 1rem !important;
  }
}
</style>
