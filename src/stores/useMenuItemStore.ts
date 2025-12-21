import { defineStore } from 'pinia'

export type ProductStatus = 'Active' | 'Hidden' | 'Out of stock'
export type Availability = 'Cafe' | 'Room' | 'Both'

export type MenuItem = {
  id: number
  sku: string
  name: string
  category: string
  price: number
  status: ProductStatus
  availability: Availability
  tags: string[]
  updatedAt: string
}

// If your backend returns different field names, map it in mapFromApi()
type MenuItemApi = any

const API_BASE = 'http://localhost:8080/api/admin/menu-items'

function mapFromApi(x: MenuItemApi): MenuItem {
  // ✅ adjust these mappings if backend fields differ
  return {
    id: x.id,
    sku: x.sku,
    name: x.name,
    category: x.category,
    price: Number(x.price ?? 0),
    status: x.status,
    availability: x.availability,
    // tags: Array.isArray(x.tags) ? x.tags : [],
    tags:[],
    updatedAt: x.updatedAt,
  }
}

async function parseError(res: Response) {
  const text = await res.text().catch(() => '')
  return text || `${res.status} ${res.statusText}`
}

export const useMenuItemsStore = defineStore('menuItems', {
  state: () => ({
    items: [] as MenuItem[],
    loading: false,
    error: null as string | null,
    lastLoadedAt: null as string | null,
  }),

  getters: {
    categoryOptions(state): string[] {
      const set = new Set<string>()
      state.items.forEach((p) => set.add(p.category))
      return Array.from(set)
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(API_BASE, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // credentials: 'include', // enable if using cookies
        })

        if (!res.ok) throw new Error(await parseError(res))

        const data = await res.json()

        // backend might return: [] OR { items: [] }
        const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []

        this.items = list.map(mapFromApi)
        this.lastLoadedAt = new Date().toISOString()
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to load menu items'
      } finally {
        this.loading = false
      }
    },

    // Optional: PATCH status endpoint (recommended)
    async updateStatus(id: number, status: ProductStatus) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_BASE}/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
        if (!res.ok) throw new Error(await parseError(res))

        // update locally (no need to refetch)
        const idx = this.items.findIndex((x) => x.id === id)
        if (idx !== -1) this.items[idx] = { ...this.items[idx], status }
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to update status'
        throw e
      } finally {
        this.loading = false
      }
    },

    // Optional: delete endpoint
    async remove(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(await parseError(res))
        this.items = this.items.filter((x) => x.id !== id)
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to delete item'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
