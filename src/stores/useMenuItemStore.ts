// src/stores/useMenuItemStore.ts
import { defineStore } from 'pinia'
import { http } from '@/lib/http'
import type { MenuItem, ProductStatus } from '@/dtos/MenuItem'

function mapFromApi(x: any): MenuItem {
  return {
    id: Number(x.id),
    sku: x.sku ?? '',
    name: x.name ?? '',
    categoryId: x.categoryId ?? null,
    availableIn: x.availableIn ?? 'BOTH',
    status: x.status ?? 'ACTIVE',
    internalNote: x.internalNote ?? '',
    shortDesc: x.shortDesc ?? '',
    category: x.categoryName ?? '',
    price: x.sizes?.[0]?.sellPrice ?? 0,
    averageRating: x.averageRating ?? 0,
    ratingCount: x.reviewCount ?? 0,

    tags: Array.isArray(x.tags) ? x.tags : [],
    sizes: Array.isArray(x.sizes) ? x.sizes : [],
    ingredients: Array.isArray(x.ingredients) ? x.ingredients : [],
    images: Array.isArray(x.images)
      ? x.images
          .filter((img: any) => img.active === true)
          .map((img: any) => ({
            id: Number(img.id),
            url: img.url,
            primary: !!img.primary,
            active: true,
            contentType: img.contentType,
            sizeBytes: img.sizeBytes,
            createdAt: img.createdAt,
          }))
      : [],
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
    'Request failed'
  )
}

export const useMenuItemsStore = defineStore('menuItems', {
  state: () => ({
    items: [] as MenuItem[],
    loading: false,
    currentItem: null as MenuItem | null,
    error: null as string | null,
    lastLoadedAt: null as string | null,
  }),

  getters: {
    categoryOptions(state): string[] {
      return Array.from(new Set(state.items.map((x) => x.category)))
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const res = await http.get('/api/admin/menu-items', { skipAuth: true })

        const data = res.data
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
              ? data.data
              : []

        this.items = list.map(mapFromApi)
        this.lastLoadedAt = new Date().toISOString()
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: number) {
      try {
        const res = await http.get(`/api/admin/menu-items/${id}`, { skipAuth: true })
        const item = mapFromApi(res.data)
        this.currentItem = item
        return item
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      }
    },

    async create(payload: any) {
      this.loading = true
      this.error = null
      try {
        const res = await http.post('/api/admin/menu-items', payload)
        return res.data
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async update(id: number, payload: any) {
      this.loading = true
      this.error = null
      try {
        const res = await http.put(`/api/admin/menu-items/${id}`, payload)
        await this.fetchAll()
        return res.data
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateStatus(id: number, status: ProductStatus) {
      this.loading = true
      this.error = null
      try {
        await http.patch(`/api/admin/menu-items/${id}/status`, { status })

        const idx = this.items.findIndex((x) => x.id === id)
        if (idx !== -1) this.items[idx] = { ...this.items[idx], status }
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async remove(id: number) {
      this.loading = true
      this.error = null
      try {
        await http.delete(`/api/admin/menu-items/${id}`)
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
