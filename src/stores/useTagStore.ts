import type { Tag } from '@/dtos/TagDto'
import { http } from '@/lib/http'
import { defineStore } from 'pinia'

type TagApi = any

function mapFromApi(x: TagApi): Tag {
  return {
    id: Number(x.id),
    name: String(x.name ?? ''),
  }
}

function axiosErrorMessage(e: any): string {
  const data = e?.response?.data
  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === 'string' ? data : null) ||
    e?.message ||
    'Resuqest failed'
  )
}

export const useTagStore = defineStore('tags', {
  state: () => ({
    items: [] as Tag[],
    loading: false,
    error: null as string | null,
    leastLoadedAt: null as string | null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null

      try {
        const res = await http.get('/api/admin/tags')

        const data = res.data
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
              ? data.data
              : []
        this.items = list.map(mapFromApi)
        this.leastLoadedAt = new Date().toISOString()
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async create(payload: { name: string }) {
      try {
        const res = await http.post('/api/admin/tags', payload)
        await this.fetchAll()
        return res.data
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      }
    },

    async update(id: number, payload: { name: string }) {
      try {
        const res = await http.put(`/api/admin/tags/${id}`, payload)
        await this.fetchAll()
        return res.data
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      }
    },

    async remove(id: number) {
      this.loading = true
      this.error = null
      try {
        await http.delete(`/api/admin/tags/${id}`)
        this.items = this.items.filter((x) => x.id !== id)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
