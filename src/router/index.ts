import { createRouter, createWebHistory } from 'vue-router'

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
import StartOrderView from '@/views/StartOrderView.vue'
import StartOrderQuickPage from '@/views/StartOrderQuickPage.vue'

import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginView from '@/views/admin/LoginView.vue'

// Admin
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminMenu from '@/views/admin/AdminMenu.vue'
import AdminOrderDetails from '@/views/admin/AdminOrderDetails.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import AdminTables from '@/views/admin/AdminTables.vue'
import MenuItemCreate from '@/views/admin/MenuItemCreate.vue'
import MenuItemUpdate from '@/views/admin/MenuItemUpdate.vue'
import PrintTest from '@/views/admin/PrintTest.vue'

// Category/Tags/Size
import CategoryTable from '@/views/admin/CategoryTable.vue'
import TagsTable from '@/views/admin/TagsTable.vue'
import SizeTable from '@/views/admin/SizeTable.vue'

// ✅ Pinia store for user session
import { useOrderSessionStore } from '@/stores/orderSession'
import AdminInvoices from '@/views/admin/AdminInvoices.vue'
import AdminInvoiceDetails from '@/views/admin/AdminInvoiceDetails.vue'
import AdminVats from '@/views/admin/AdminVats.vue'

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
      {
        path: 'start',
        name: 'start-order',
        component: StartOrderView,
        meta: { publicOrderEntry: true },
      },
      {
        path: 'start/:orderType/:placeNumber',
        name: 'start-quick',
        component: StartOrderQuickPage,
        meta: { publicOrderEntry: true },
      },
      {
        path: 'scan/:orderType/:placeNumber',
        name: 'scan-order',
        component: StartOrderQuickPage,
        meta: { publicOrderEntry: true },
      },
      {
        path: 'orders/:invoiceId',
        name: 'orders-invoice',
        component: OrdersPage,
        meta: { requiresOrderSession: true },
      },
      {
        path: 'orders/:id',
        name: 'order-status',
        component: OrderStatusPage,
        meta: { requiresOrderSession: true },
      },
      { path: 'cart', name: 'cart', component: CartPage, meta: { requiresOrderSession: true } },
      {
        path: 'payment',
        name: 'payment',
        component: PaymentPage,
        meta: { requiresOrderSession: true },
      },
      {
        path: '/checkout/pay/:method',
        name: 'checkoutPay',
        component: () => import('@/views/CheckoutPay.vue'),
      },
      {
        path: 'payment/success',
        name: 'paymentSuccess',
        component: () => import('@/views/PaymentSuccess.vue'),
      },
      {
        path: '/shop',
        name: 'shop',
        component: ShopPage,
        meta: { requiresAuth: false },
      },
      { path: 'contact', name: 'contact', component: ContactPage },
      { path: 'about', name: 'about', component: aboutPage },
      { path: 'products', name: 'products', component: ProductsPage },
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
      { path: 'print', name: 'test-print', component: PrintTest },
      { path: 'menu', name: 'admin-menu', component: AdminMenu },
      { path: 'tables', name: 'admin-tables', component: AdminTables },
      { path: 'invoices', name: 'admin-invoices', component: AdminInvoices },
      { path: 'invoices/:id', name: 'admin-invoice-detail', component: AdminInvoiceDetails },
      { path: 'settings', name: 'admin-settings', component: AdminSettings },
      { path: 'orders/:id', name: 'admin-order-details', component: AdminOrderDetails },
      { path: 'menu-items/new', name: 'admin-menu-new', component: MenuItemCreate },
      { path: 'menu-items/:id/edit', name: 'admin-menu-edit', component: MenuItemUpdate },
      { path: 'category/table', name: 'category-table', component: CategoryTable },
      { path: 'tags/table', name: 'tags-table', component: TagsTable },
      { path: 'sizes/table', name: 'size-table', component: SizeTable },
      { path: 'vats', name: 'admin-vat-list', component: AdminVats },

    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginRoute = to.name === 'login' || to.path.startsWith('/login')

  if (isAdminRoute && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (isLoginRoute) {
    if (token) return { name: 'admin-dashboard' }
    return true
  }

  if (!isAdminRoute) {
    const session = useOrderSessionStore()
    session.hydrate()

    const isPublicEntryRoute = to.matched.some((r) => r.meta.publicOrderEntry)

    if (isPublicEntryRoute) {
      return true
    }

    if (!session.isReady) {
      return {
        name: 'start-order',
        query: { redirect: to.fullPath },
      }
    }
  }

  return true
})

export default router
