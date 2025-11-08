import { createRouter, createWebHistory } from 'vue-router'
import aboutPage from "@/views/AboutPage.vue"
import ProductsPage from '@/views/ProductsPage.vue'
const routes = [
  { path: '/about', name: 'about', component: aboutPage },
  { path: '/products', name: 'products', component: ProductsPage },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
