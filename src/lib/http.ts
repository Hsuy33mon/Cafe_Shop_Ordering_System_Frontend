import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const http = axios.create({
  baseURL: 'http://localhost:8080',
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
