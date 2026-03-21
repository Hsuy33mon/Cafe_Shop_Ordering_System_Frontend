<template>
  <main class="start-wrap">
    <section class="start-card">
      <header class="start-head">
        <p class="start-kicker">WELCOME TO CAFESHOP</p>
        <h1 class="start-title">Start your order</h1>
        <p class="start-sub">Please enter your name to continue.</p>
      </header>

      <form class="start-form" @submit.prevent="onContinue">
        <div class="field">
          <label class="label" for="name">Your name</label>
          <input
            id="name"
            v-model="customerName"
            class="input"
            type="text"
            autocomplete="name"
            placeholder="e.g. Min"
            maxlength="50"
            required
          />
        </div>

        <div class="field">
          <label class="label">Order type</label>
          <input class="input" :value="orderType" type="text" readonly />
        </div>

        <div class="field">
          <label class="label">
            {{ orderType === 'ROOM' ? 'Room number' : 'Table number' }}
          </label>
          <input class="input" :value="placeNumber" type="text" readonly />
        </div>

        <div class="actions">
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="!canContinue || orderPlacesStore.loading"
          >
            {{ orderPlacesStore.loading ? 'Loading...' : 'Continue' }}
          </button>
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderSessionStore } from '@/stores/orderSession'
import { useOrderPlacesStore } from '@/stores/useOrderPlaceStore'

type OrderType = 'TABLE' | 'ROOM'

const route = useRoute()
const router = useRouter()
const session = useOrderSessionStore()
const orderPlacesStore = useOrderPlacesStore()

const customerName = ref('')
const errorMsg = ref('')

const orderType = ref<OrderType>('TABLE')
const placeNumber = ref('')

onMounted(() => {
  session.hydrate?.()

  const routeOrderType = String(route.params.orderType || '').toUpperCase()
  const routePlaceNumber = String(route.params.placeNumber || '').trim()

  if (routeOrderType !== 'TABLE' && routeOrderType !== 'ROOM') {
    errorMsg.value = 'Invalid order type.'
    return
  }

  if (!routePlaceNumber) {
    errorMsg.value = 'Invalid table or room number.'
    return
  }

  orderType.value = routeOrderType as OrderType
  placeNumber.value = routePlaceNumber
  customerName.value = session.customerName || ''
})

const canContinue = computed(() => {
  return customerName.value.trim().length >= 2 && !!placeNumber.value
})

async function onContinue() {
  errorMsg.value = ''

  if (customerName.value.trim().length < 2) {
    errorMsg.value = 'Please enter your name.'
    return
  }

  try {
    const place = await orderPlacesStore.fetchByNo(placeNumber.value)

    if (!place || !place.id) {
      errorMsg.value = 'Table or room not found.'
      return
    }

    session.setSession({
      customerName: customerName.value.trim(),
      orderType: orderType.value,
      placeNumber: placeNumber.value,
      tableNumber: placeNumber.value,
      orderPlaceId: place.id,
    })

    const redirect = (route.query.redirect as string) || '/shop'
    router.replace(redirect)
  } catch (e) {
    errorMsg.value = orderPlacesStore.error || 'Failed to continue.'
  }
}
</script>

<style scoped src="@/styles/customer/start-order.css"></style>
