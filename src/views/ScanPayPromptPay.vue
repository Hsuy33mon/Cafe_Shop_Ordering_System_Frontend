<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useOrderSessionStore } from '../stores/orderSession'
import { usePaymentStore } from '../stores/usePaymentStore'
import { useWsStore } from '@/stores/useWsStore'

const router = useRouter()
const cartStore = useCartStore()
const session = useOrderSessionStore()
const paymentStore = usePaymentStore()
const wsStore = useWsStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.cartSubtotal)
const totalIngredientPrice = computed(() => cartStore.totalIngredientPrice)
const total = computed(() => subtotal.value + totalIngredientPrice.value)

const customerName = computed(() => session.customerName || 'MIN PYAE HEIN')
const tableNumber = computed(() => session.placeNumber || '12')
const orderPlaceId = computed(() => Number(tableNumber.value) || 1)
const promptPayId = computed(() => '0891234567')

const payment = computed(() => paymentStore.payment)
const loading = computed(() => paymentStore.loading)
const errorMsg = computed(() => paymentStore.error)
const expiresInText = computed(() => paymentStore.expiresInText)

const paidConfirmed = ref(false) // ✅ FIX

function formatMoney(value: number): string {
  return `฿${Number(value).toFixed(0)}`
}

async function refreshQr() {
  await paymentStore.refreshQr({
    orderPlaceId: orderPlaceId.value,
    customerName: customerName.value,
    promptPayId: promptPayId.value,
  })
}

function changeMethod() {
  paymentStore.cancelPayment()
  router.push({ name: 'checkoutPaymentMethod' })
}

function goToCheckout() {
  router.push({ name: 'cart' })
}

function goToHome() {
  router.push({ name: 'home' })
}

// optional button: keep or remove
async function confirmPaid() {
  // you can keep this as fallback, but WS should auto redirect
  router.push({ name: 'paymentSuccess' })
}

let timer: number | undefined
let subscribed = false

onMounted(async () => {
  await refreshQr()

  await paymentStore.ensurePromptPayPayment({
    orderPlaceId: orderPlaceId.value,
    customerName: customerName.value,
    promptPayId: promptPayId.value,
  })
  wsStore.connect()
  watch(
    () => payment.value?.id,
    (paymentId) => {
      if (!paymentId || subscribed) return
      subscribed = true

      wsStore.subscribePayment(Number(paymentId), (evt) => {
        if (evt.paymentStatus === 'PAID') {
          router.push({ name: 'paymentSuccess' })
        }
      })
    },
    { immediate: true },
  )

  timer = window.setInterval(() => paymentStore.tick(), 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
  paymentStore.cancelPayment()
})
</script>