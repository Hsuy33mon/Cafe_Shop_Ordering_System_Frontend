import { createRouter, createWebHistory } from 'vue-router'
import aboutPage from "@/views/AboutPage.vue"
const routes = [
  { path: '/about', name: 'about', component: aboutPage }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
