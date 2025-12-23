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
