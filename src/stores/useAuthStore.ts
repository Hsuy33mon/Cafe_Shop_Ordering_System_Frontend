// src/stores/useAuthStore.ts
import { defineStore } from 'pinia'
import { loginApi, type LoginRequest } from '@/services/authApi'

type AuthState = {
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (s) => !!s.token
  },

  actions: {
    async login(payload: LoginRequest) {
      this.loading = true
      this.error = null
      try {
        const data = await loginApi(payload)

        const token = data.accessToken || data.token
        if (!token) throw new Error('No token returned from server')

        this.token = token
        localStorage.setItem('token', token)

        return data
      } catch (e: any) {
        this.error = e?.message || 'Login failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
