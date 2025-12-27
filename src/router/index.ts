import UserLayout from '@/components/layout/UserLayout.vue'
import aboutPage from '@/views/AboutPage.vue'
import CartPage from '@/views/CartPage.vue'
import ContactPage from '@/views/ContactPage.vue'
import HomePage from '@/views/HomePageView.vue'
import OrderStatusPage from '@/views/OrderStatusPage.vue'
import OrdersPage from '@/views/OrdersPage.vue'
import PaymentPage from '@/views/PaymentPage.vue'
import ProductDetailsView from '@/views/ProductDetailsView.vue'
import ProductsPage from '@/views/ProductsPage.vue'
import ShopPage from '@/views/ShopPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Admin views
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminCustomers from '@/views/admin/AdminCustomers.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminMenu from '@/views/admin/AdminMenu.vue'
import AdminOrderDetails from '@/views/admin/AdminOrderDetails.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import AdminTables from '@/views/admin/AdminTables.vue'
import MenuItemCreate from '@/views/admin/MenuItemCreate.vue'

// Cateogry views
import CategoryTable from '@/views/admin/CategoryTable.vue'
import CategoryCreate from '@/views/admin/CategoryCreate.vue'

// Tags views
import TagsTable from '@/views/admin/TagsTable.vue'

import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginView from '@/views/admin/LoginView.vue'



const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [{ path: '', name: 'login', component: LoginView }],
  },
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
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
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'orders', name: 'admin-orders', component: AdminOrders },
      { path: 'menu', name: 'admin-menu', component: AdminMenu },
      { path: 'tables', name: 'admin-tables', component: AdminTables },
      { path: 'customers', name: 'admin-customers', component: AdminCustomers },
      { path: 'settings', name: 'admin-settings', component: AdminSettings },
      { path: 'orders/:id', name: 'admin-order-details', component: AdminOrderDetails },
      { path: 'menu-items/new', name: 'admin-menu-new', component: MenuItemCreate },

      // Category
      {path: 'category/table', name: 'category-table', component: CategoryTable},
      {path: 'category/new', name: 'admin-category-new', component: CategoryCreate},

      // Tags
      {path: 'tags/table', name: 'tags-table', component: TagsTable}

    ],
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAdminRoute = to.path.startsWith('/admin')
  const token = localStorage.getItem('token')

  if (isAdminRoute && !token) {
    return { name: 'login' }
  }

  // optional: if logged in, block going to /login
  if (to.name === 'login' && token) {
    return { name: 'admin-dashboard' }
  }
})

export default router
