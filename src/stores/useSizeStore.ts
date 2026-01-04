import type { Size } from "@/dtos/SizeDto"
import { http } from "@/lib/http"
import { defineStore } from "pinia"

type SizeApi = any

function mapFromApi(x: SizeApi) : Size {
  return{
    id: Number(x.id),
    name: String(x.name ?? ''),
    shortName: String(x.shortName ?? '')
  }
}


function axiosErrorMessage(e: any) : string {
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

export const useSizeStore = defineStore('sizes' , {
  state: () => ({
    items: [] as Size[],
    loading: false,
    error: null as string | null,
    leastLoadedAt: null as string | null,
  }),

  actions: {
    async fetchAll(){
      this.loading = true
      this.error = null
      try{
        const res = await http.get('/api/admin/sizes')

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
      } catch (e: any){
        this.error = axiosErrorMessage(e)
      }finally{
        this.loading = false
      }
    },

    async create(payload: {name: string; shortName: string}){
      try{
        const res = await http.post('/api/admin/sizes', payload)
        await this.fetchAll()
        return res.data
      }catch (e: any){
        this.error = axiosErrorMessage(e)
        throw e
      }
    },

    async remove(id:number){
      this.loading = true
      this.error = null
      try{
        await http.delete(`/api/admin/sizes/${id}`)
        this.items = this .items.filter((x) => x.id != id)
      }catch (e: any){
        this.error = axiosErrorMessage(e)
        throw e
      }finally{
        this.loading = false
      }
    }
  }
})
