// src/dtos/MenuItem.ts

// ✅ match your backend values (you are using ACTIVE / INACTIVE / OUT_OF_STOCK in Vue)
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
export type Availability = 'CAFE_ONLY' | 'ROOM_SERVICE_ONLY' | 'BOTH'

export type MenuItemSize = {
  id?: number
  size_id: number
  name?: string
  shortName?: string
  sellPrice: number
  originalPrice?: number | null
  description?: string | null
}

export type MenuItemIngredient = {
  id?: number
  name: string
  amount?: string | null
  price?: number | null
  note?: string | null
  active?: boolean
}

export type MenuItemImage = {
  id: number
  url: string
  primary: boolean
  contentType?: string
  sizeBytes?: number
  createdAt?: string
}

export type MenuItem = {
  id: number
  sku: string
  name: string

  // list/table
  category: string
  price: number

  // edit form
  categoryId: number | null
  status: ProductStatus
  availableIn: Availability
  internalNote: string
  shortDesc?: string

  // relations
  tags: { id: number; name: string }[]
  sizes: MenuItemSize[]
  ingredients: MenuItemIngredient[]
  images: MenuItemImage[]

  updatedAt?: string
  createdAt?: string
  active?: boolean
}