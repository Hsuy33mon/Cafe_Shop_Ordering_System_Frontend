import { createRouter, createWebHistory } from 'vue-router'
import UserLayout from '@/components/layout/UserLayout.vue'
import aboutPage from '@/views/AboutPage.vue'
import ProductsPage from '@/views/ProductsPage.vue'
import CartPage from '@/views/CartPage.vue'
import Homepage from '@/views/Homepage.vue'
import ContactPage from '@/views/ContactPage.vue'
import PaymentPage from '@/views/PaymentPage.vue'
import ShopPage from '@/views/ShopPage.vue'
import OrderStatusPage from '@/views/OrderStatusPage.vue'
import OrdersPage from '@/views/OrdersPage.vue'
import ProductDetailsView from '@/views/ProductDetailsView.vue'

// Admin views
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import AdminMenu from '@/views/admin/AdminMenu.vue'
import AdminTables from '@/views/admin/AdminTables.vue'
import AdminCustomers from '@/views/admin/AdminCustomers.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import AdminOrderDetails from '@/views/admin/AdminOrderDetails.vue'
import MenuItemCreate from '@/views/admin/MenuItemCreate.vue'

const routes = [
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: Homepage },
      { path: 'orders', name: 'orders', component: OrdersPage },
      { path: 'orders/:id', name: 'order-status', component: OrderStatusPage },
      { path: 'shop', name: 'shop', component: ShopPage },
      { path: 'contact', name: 'contact', component: ContactPage },
      { path: 'about', name: 'about', component: aboutPage },
      { path: 'products', name: 'products', component: ProductsPage },
      { path: 'cart', name: 'cart', component: CartPage },
      { path: 'payment', name: 'payment', component: PaymentPage },
      { path: 'products/:id', name: 'product-details', component: ProductDetailsView },
    ],
  },
  // ADMIN AREA
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboard,
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: AdminOrders,
      },
      {
        path: 'menu',
        name: 'admin-menu',
        component: AdminMenu,
      },
      { path: 'tables', name: 'admin-tables', component: AdminTables },
      { path: 'customers', name: 'admin-customers', component: AdminCustomers },
      { path: 'settings', name: 'admin-settings', component: AdminSettings },
      { path: 'orders/:id', name: 'admin-order-details', component: AdminOrderDetails },
      { path: 'menu-items/new', name: 'admin-menu-new', component: MenuItemCreate },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
