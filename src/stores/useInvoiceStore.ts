import { defineStore } from 'pinia'
import axios from 'axios'

export interface InvoiceOrder {
  id: number
  menuItemName: string
  sizeName: string
  qty: number
  unitPrice: number
  lineTotal: number
  note: string
}

export interface InvoicePayment {
  id: number
  amount: number
  method: string
  status: string
  gateway: string
  referenceNo: string
}

export interface Invoice {
  id: number
  invoiceNo: string | null
  customerName: string
  subTotal: number
  tax: number
  deliveryFee: number
  grandTotal: number
  status: string
  appliedAt: string
  createdAt: string
  orderPlaceName: string | null
  orders: InvoiceOrder[]
  payments: InvoicePayment[]
}

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [] as Invoice[],        // 🔥 ADD THIS
    currentInvoice: null as Invoice | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {

    // 🔥 FETCH ALL INVOICES (LIST PAGE)
   async fetchAll() {
  try {
    this.loading = true
    this.error = null

    const res = await axios.get('/api/admin/invoices')

    // Normalize null values
    this.invoices = res.data.map((inv: any) => ({
      ...inv,
      invoiceNo: inv.invoiceNo ?? `INV-${inv.id}`,
      orderPlaceName: inv.orderPlaceName ?? '-',
    }))

  } catch (err: any) {
    this.error = err.message
  } finally {
    this.loading = false
  }
},

    // 🔥 FETCH SINGLE INVOICE (DETAIL PAGE)
    async fetchById(id: number) {
      try {
        this.loading = true
        this.error = null

        const res = await axios.get(`/api/admin/invoices/${id}`)

        // Backend returns array
        const data = res.data?.[0] || null

        this.currentInvoice = data

      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
