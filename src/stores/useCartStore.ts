import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type CartIngredient = {
  id: number
  name: string
  price: number
  amount: string
  qty?: number
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

type PersistedCart = {
  items: CartItem[]
  customerName: string
  tableNumber: string
}

const STORAGE_KEY = 'cafeshop_cart_v1'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const customerName = ref('')
  const tableNumber = ref('')

  function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const data: PersistedCart = JSON.parse(raw)
      items.value = Array.isArray(data.items) ? data.items : []
      customerName.value = data.customerName ?? ''
      tableNumber.value = data.tableNumber ?? ''
    } catch {
      // if corrupted, clear it
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function saveToStorage() {
    const payload: PersistedCart = {
      items: items.value,
      customerName: customerName.value,
      tableNumber: tableNumber.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  // run once when store is created
  loadFromStorage()

  // auto-save whenever cart changes
  watch(
    [items, customerName, tableNumber],
    () => {
      saveToStorage()
    },
    { deep: true },
  )

  function addItem(item: Omit<CartItem, 'cartId'>) {
    items.value.push({
      ...item,
      cartId: Date.now() + Math.random(),
    })
  }

  function removeItem(cartId: number) {
    items.value = items.value.filter((i) => i.cartId !== cartId)
  }

  function increaseQty(cartId: number) {
    const item = items.value.find((i) => i.cartId === cartId)
    if (item) item.quantity++
  }

  function decreaseQty(cartId: number) {
    const item = items.value.find((i) => i.cartId === cartId)
    if (item && item.quantity > 1) item.quantity--
  }

  function clearCart() {
    items.value = []
    customerName.value = ''
    tableNumber.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  const cartSubtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  )

  const totalIngredientPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const ingredientTotalPerItem = item.ingredients.reduce((ingSum, ing) => ingSum + ing.price, 0)
      return sum + ingredientTotalPerItem * item.quantity
    }, 0),
  )
  const totalPrice = computed(() => cartSubtotal.value + totalIngredientPrice.value)

  return {
    items,
    customerName,
    tableNumber,

    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,

    cartSubtotal,
    totalIngredientPrice,
    totalPrice,
  }
})
