import type { Category } from '@/dtos/CategoryDto'
import { http } from '@/lib/http'
import {defineStore} from 'pinia'

type CategoryApi = any

function mapFromApi(x: CategoryApi) : Category {
  return{
    id: Number(x.id),
    name: String(x.name ?? ''),
    slug: String(x.slug ?? ''),
    menuItemCount: Number(x.menuItemCount ?? 0),
    updatedAt: String(x.updatedAt ?? '')
  }
}

function axiosErrorMessage(e: any): string {
  const data = e?.response?.data
  return(
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === 'string' ? data : null) ||
    e?.message ||
    'Request failed'
    )
}

export const useCategoryStore = defineStore('categories' , {
  state: () => ({
    items: [] as Category[],
    loading: false,
    error: null as string | null,
    leastLoadedAt: null as string | null,
  }),

  actions: {
    async fetchAll(){
      this.loading = true
      this.error = null

      try{
        const res = await http.get('/api/admin/categories')

        const data = res.data
        const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.items)
                      ?data.items
                      : Array.isArray(data?.data)
                        ? data.data
                        : []
        this.items = list.map(mapFromApi)
        this.leastLoadedAt = new Date().toISOString()
      } catch (e: any){
        this.error = axiosErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async remove(id:number) {
      this.loading = true
      this.error = null
      try{
        await http.delete(`/api/admin/categories/${id}`)
        this.items = this.items.filter((x) => x.id !== id)
      } catch (e: any) {
        this.error = axiosErrorMessage(e)
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})


