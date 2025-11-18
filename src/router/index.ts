import { createRouter, createWebHistory } from 'vue-router'
import aboutPage from '@/views/AboutPage.vue'
import ProductsPage from '@/views/ProductsPage.vue'
import CartPage from '@/views/CartPage.vue'
import Homepage from '@/views/Homepage.vue'
import ContactPage from '@/views/ContactPage.vue'
import PaymentPage from '@/views/PaymentPage.vue'
import ShopPage from '@/views/ShopPage.vue'
import AdminHomePage from '@/views/admin/HomePage.vue'
const routes = [
  { path: '/', name: 'home', component: Homepage },
  { path: '/admin', name: 'adminHome', component: AdminHomePage },
  { path: '/shop', name: 'shop', component: ShopPage },
  { path: '/contact', name: 'contact', component: ContactPage },
  { path: '/about', name: 'about', component: aboutPage },
  { path: '/products', name: 'products', component: ProductsPage },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/payment', name: 'payment', component: PaymentPage },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
