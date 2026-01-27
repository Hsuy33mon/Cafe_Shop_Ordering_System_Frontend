export type ProductStatus = 'Active' | 'Hidden' | 'Out of stock'
export type Availability = 'Cafe' | 'Room' | 'Both'

export type MenuItemSize = {
  size_id: number
  name: string
  shortName: string
  sellPrice: number
  originalPrice: number
}

export type MenuItem = {
  id: number
  sku: string
  name: string
  category: string
  price: number
  status: ProductStatus
  availability: string
  tags: { id: number; name: string }[]

  shortDesc?: string
  sizes?: MenuItemSize[]

  updatedAt: string
}
