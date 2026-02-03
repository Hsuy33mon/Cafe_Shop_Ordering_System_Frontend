// src/lib/http.ts
import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/useAuthStore'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Auto attach token on every request
http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  const token = auth.token || localStorage.getItem('token')

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || ''
    const isExpired = String(message).toLowerCase().includes('expired')

    if (status === 401) {
      const auth = useAuthStore()
      auth.logout()

      if (router.currentRoute.value.path !== '/login') {
        router.replace({
          path: '/login',
          query: { reason: isExpired ? 'expired' : 'unauthorized' },
        })
      }
    }

    return Promise.reject(error)
  },
)
