import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type CartIngredient = {
  id: number
  name: string
  price: number
  amount: string
}

export type CartItem = {
  cartId: number
  productId: number

  name: string
  description: string
  imageUrl: string

  sizeId: number
  sizeName: string

  ingredients: CartIngredient[]

  quantity: number

  unitPrice: number
  totalPrice: number
  totalIngredientPrice: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const customerName = ref('')
  const tableNumber = ref('')

  function addItem(item: Omit<CartItem, 'cartId'>) {
  items.value.push({
    ...item,
    cartId: Date.now() + Math.random()
  })
}


  function removeItem(cartId: number) {
    items.value = items.value.filter(i => i.cartId !== cartId)
  }

  function increaseQty(cartId: number) {
    const item = items.value.find(i => i.cartId === cartId)
    if (item) item.quantity++
  }

  function decreaseQty(cartId: number) {
    const item = items.value.find(i => i.cartId === cartId)
    if (item && item.quantity > 1) item.quantity--
  }

  const cartSubtotal = computed(() =>
  items.value.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
)


  const totalIngredientPrice = computed(() => 0)

  const totalPrice = computed(() => cartSubtotal.value)

  return {
    items,
    customerName,
    tableNumber,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    cartSubtotal,
    totalIngredientPrice,
    totalPrice
  }
})
