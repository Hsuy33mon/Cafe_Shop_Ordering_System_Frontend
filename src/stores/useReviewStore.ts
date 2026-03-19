import type { Review } from '@/dtos/ReviewDto'
import { http } from '@/lib/http'
import { defineStore } from 'pinia'

type ReviewApi = any

function mapFromApi(x: ReviewApi): Review {
  return {
    id: Number(x.id),
    rating: Number(x.rating ?? 0),
    comment: String(x.comment ?? ''),
    reviewerName: String(x.reviewerName ?? ''),
    createdAt: String(x.createdAt ?? ''),
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

export const useReviewStore = defineStore('reviews', {
  state: () => ({
    items: [] as Review[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchByMenuItem(menuItemId: number) {
      this.loading = true
      this.error = null
      try {
        const res = await http.get(`/api/menu-items/${menuItemId}/reviews`,{ skipAuth: true })
        const data = res.data

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
              ? data.data
              : []

        this.items = list.map(mapFromApi)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async create(
      menuItemId: number,
      payload: {
        rating: number
        comment: string
        reviewerName: string
      },
    ) {
      this.error = null
      try {
        await http.post(`/api/menu-items/${menuItemId}/reviews`, payload,{ skipAuth: true })

        // refresh after submit
        await this.fetchByMenuItem(menuItemId)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      }
    },
  },
})
