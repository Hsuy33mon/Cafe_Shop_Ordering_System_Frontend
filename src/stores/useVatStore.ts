import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export interface Vat {
  id: number
  vatCode: string
  vatName: string
  taxType: string
  vatRate: number
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export const useVatStore = defineStore('vat', {
  state: () => ({
    vats: [] as Vat[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAll() {
      try {
        this.loading = true
        this.error = null

        const res = await http.get('/api/admin/vats')

        // this.vats = res.data
        this.vats = res.data.map((v: any) => ({
          ...v,

          // ✅ normalize backend → frontend
          isActive: v.isActive ?? v.active,
          isDefault: v.isDefault ?? v.default,
        }))

      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async createVat(payload: Partial<Vat>) {
      try {

        console.log('SEND:', payload)

        await http.post('/api/admin/vats', payload)
        await this.fetchAll()
      } catch (err: any) {
        console.error('CREATE ERROR:', err.response?.data || err.message)
        this.error = err.message
      }

    },

    async updateVat(id: number, payload: Partial<Vat>) {
      try {
        await http.put(`/api/admin/vats/${id}`, payload)
        await this.fetchAll()
      } catch (err: any) {
        this.error = err.message
      }
    },

    async deleteVat(id: number) {
      try {
        await http.delete(`/api/admin/vats/${id}`)
        this.vats = this.vats.filter((v) => v.id !== id)
      } catch (err: any) {
        this.error = err.message
      }
    },
  },
})
