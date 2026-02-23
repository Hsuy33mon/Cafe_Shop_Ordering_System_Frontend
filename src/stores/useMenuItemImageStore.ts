import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export type MenuItemImageDto = {
  id: number
  url: string
  primary: boolean
  contentType?: string
  sizeBytes?: number
  createdAt?: string
}

function errMsg(e: any) {
  const d = e?.response?.data
  return d?.message || d?.error || d?.detail || (typeof d === 'string' ? d : null) || e?.message || 'Request failed'
}

export const useMenuItemImageStore = defineStore('menuItemImages', {
  state: () => ({
    items: [] as MenuItemImageDto[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    setItems(images: any[]) {
      this.items = (Array.isArray(images) ? images : []).map((x: any) => ({
        id: Number(x.id),
        url: x.url,
        primary: !!x.primary,
        contentType: x.contentType,
        sizeBytes: x.sizeBytes,
        createdAt: x.createdAt,
      }))
    },

    async upload(menuItemId: number, files: File[], primaryIndex = 0) {
      this.loading = true
      this.error = null
      try {
        const fd = new FormData()
        files.forEach((f) => fd.append('files', f))
        fd.append('primaryIndex', String(primaryIndex))

        const res = await http.post(`/api/menuItems/${menuItemId}/images`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        // backend returns List<MenuItemImageDto>
        this.setItems(res.data)
        return this.items
      } catch (e: any) {
        this.error = errMsg(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async replaceFile(menuItemId: number, imageId: number, file: File) {
      this.loading = true
      this.error = null
      try {
        const fd = new FormData()
        fd.append('file', file)

        const res = await http.put(`/api/menuItems/${menuItemId}/images/${imageId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const updated = res.data
        const idx = this.items.findIndex((x) => x.id === imageId)
        if (idx !== -1) {
          this.items[idx] = {
            id: Number(updated.id),
            url: updated.url,
            primary: !!updated.primary,
            contentType: updated.contentType,
            sizeBytes: updated.sizeBytes,
            createdAt: updated.createdAt,
          }
        }
        return this.items[idx]
      } catch (e: any) {
        this.error = errMsg(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async setPrimary(menuItemId: number, imageId: number) {
      this.loading = true
      this.error = null
      try {
        await http.patch(`/api/menuItems/${menuItemId}/images/${imageId}/primary`)
        this.items = this.items.map((img) => ({ ...img, primary: img.id === imageId }))
      } catch (e: any) {
        this.error = errMsg(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async delete(menuItemId: number, imageId: number) {
      this.loading = true
      this.error = null
      try {
        await http.delete(`/api/menuItems/${menuItemId}/images/${imageId}`)
        this.items = this.items.filter((x) => x.id !== imageId)
      } catch (e: any) {
        this.error = errMsg(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})