<template>
  <main class="start-wrap">
    <section class="start-card">
      <header class="start-head">
        <p class="start-kicker">WELCOME TO CAFESHOP</p>
        <h1 class="start-title">Start your order</h1>
        <p class="start-sub">
          {{
            isMobile
              ? 'Scan your table/room QR to continue.'
              : 'Enter your name and select table/room to continue.'
          }}
        </p>
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

        <!-- DESKTOP -->
        <div v-if="!isMobile" class="desktop-area">
          <div class="field">
            <p class="label">Order type</p>

            <div class="radio-row">
              <label class="radio">
                <input type="radio" name="orderType" value="TABLE" v-model="orderType" />
                <span>Table</span>
              </label>

              <label class="radio">
                <input type="radio" name="orderType" value="ROOM" v-model="orderType" />
                <span>Room</span>
              </label>
            </div>
          </div>

          <div class="field">
            <label class="label" :for="placeInputId">{{ placeLabel }}</label>
            <input
              :id="placeInputId"
              v-model="placeNumber"
              class="input"
              type="text"
              inputmode="numeric"
              :placeholder="orderType === 'ROOM' ? 'e.g. 305' : 'e.g. 12'"
              maxlength="10"
              required
            />
            <p class="hint">Tip: you can also use the QR on the table/room.</p>
          </div>

          <div class="actions">
            <button class="btn btn-primary" type="submit" :disabled="!canContinueDesktop">
              Next
            </button>
          </div>
        </div>

        <!-- MOBILE -->
        <div v-else class="mobile-area">
          <div class="mobile-actions">
            <button type="button" class="btn btn-primary" @click="openScanner">Scan QR</button>

            <button type="button" class="btn btn-ghost" @click="toggleManual">
              {{ manualMode ? 'Hide manual entry' : 'Enter manually' }}
            </button>
          </div>

          <div v-if="manualMode" class="field order-type-field">
            <p class="label">Order type</p>

            <div class="radio-row">
              <label class="radio-pill">
                <input type="radio" name="orderTypeMobile" value="TABLE" v-model="orderType" />
                <span>Table</span>
              </label>

              <label class="radio-pill">
                <input type="radio" name="orderTypeMobile" value="ROOM" v-model="orderType" />
                <span>Room</span>
              </label>
            </div>

            <label class="label mt-10" :for="placeInputIdMobile">{{ placeLabel }}</label>
            <input
              :id="placeInputIdMobile"
              v-model="placeNumber"
              class="input"
              type="text"
              inputmode="numeric"
              :placeholder="orderType === 'ROOM' ? 'e.g. 305' : 'e.g. 12'"
              maxlength="10"
            />

            <div class="actions mt-10">
              <button class="btn btn-primary" type="submit" :disabled="!canContinueMobile">
                Continue
              </button>
            </div>
          </div>
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <!-- Scanner Modal (mobile) -->
        <div v-if="scanning" class="modal" role="dialog" aria-modal="true">
          <div class="modal-card">
            <div class="modal-head">
              <div>
                <p class="modal-title">Scan QR</p>
                <p class="modal-sub">Point your camera at the QR code.</p>
              </div>
              <button
                type="button"
                class="icon-btn"
                @click="closeScanner"
                aria-label="Close scanner"
              >
                ✕
              </button>
            </div>

            <div class="video-frame">
              <!-- ✅ autoplay helps iOS -->
              <video ref="videoEl" class="video" playsinline autoplay muted></video>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-ghost w-full" @click="closeScanner">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { useOrderSessionStore } from '@/stores/orderSession'

type OrderType = 'TABLE' | 'ROOM'

const router = useRouter()
const route = useRoute()
const session = useOrderSessionStore()

const customerName = ref(session.customerName || '')
const orderType = ref<OrderType>((session.orderType as OrderType) || 'TABLE')
const placeNumber = ref(session.placeNumber || session.tableNumber || '')

const errorMsg = ref('')
const manualMode = ref(false)

const scanning = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)

let reader: BrowserMultiFormatReader | null = null
let activeStream: MediaStream | null = null

// responsive
const isMobile = ref(false)
function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)

  session.hydrate()

  const hasRedirect = typeof route.query.redirect === 'string' && route.query.redirect.length > 0
  if (!hasRedirect) session.clear()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  stopScanner()
})

const placeLabel = computed(() => (orderType.value === 'ROOM' ? 'Room number' : 'Table number'))
const placeInputId = computed(() => (orderType.value === 'ROOM' ? 'room' : 'table'))
const placeInputIdMobile = computed(() => (orderType.value === 'ROOM' ? 'roomMobile' : 'tableMobile'))

const canContinueDesktop = computed(() => {
  return customerName.value.trim().length >= 2 && placeNumber.value.trim().length >= 1
})
const canContinueMobile = computed(() => {
  return customerName.value.trim().length >= 2 && placeNumber.value.trim().length >= 1
})

function toggleManual() {
  errorMsg.value = ''
  manualMode.value = !manualMode.value
}

/**
 * Supports QR formats like:
 *  - "TABLE:12"
 *  - "ROOM:305"
 *  - "?type=TABLE&no=12"
 *  - "?table=12"
 *  - "?room=305"
 *  - "12" (fallback -> uses current selected orderType)
 */
function parseOrderFromQr(text: string): { orderType?: OrderType; placeNumber?: string } | null {
  const t = text.trim()

  const m1 = t.match(/^(TABLE|ROOM)\s*:\s*([A-Za-z0-9-]{1,10})$/i)
  if (m1?.[1] && m1?.[2]) {
    return { orderType: m1[1].toUpperCase() as OrderType, placeNumber: m1[2] }
  }

  const typeParam = t.match(/(?:\?|&)type=(TABLE|ROOM)/i)?.[1]
  const noParam = t.match(/(?:\?|&)(?:no|number)=([A-Za-z0-9-]{1,10})/i)?.[1]
  if (typeParam && noParam) {
    return { orderType: typeParam.toUpperCase() as OrderType, placeNumber: noParam }
  }

  const tableParam = t.match(/(?:\?|&)table=([A-Za-z0-9-]{1,10})/i)?.[1]
  if (tableParam) return { orderType: 'TABLE', placeNumber: tableParam }

  const roomParam = t.match(/(?:\?|&)room=([A-Za-z0-9-]{1,10})/i)?.[1]
  if (roomParam) return { orderType: 'ROOM', placeNumber: roomParam }

  const m4 = t.match(/^([A-Za-z0-9-]{1,10})$/)
  if (m4?.[1]) return { placeNumber: m4[1] }

  return null
}

async function openScanner() {
  errorMsg.value = ''
  scanning.value = true

  // ✅ wait for modal + video to mount
  await nextTick()

  if (!videoEl.value) {
    errorMsg.value = 'Camera view not ready. Please try again.'
    scanning.value = false
    return
  }

  // clean previous session if any
  stopScanner()

  reader = new BrowserMultiFormatReader()

  try {
    // ✅ request permission first (fix iOS + avoids empty device list)
    activeStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    })

    // attach stream to video
    videoEl.value.srcObject = activeStream
    await videoEl.value.play()

    // decode QR from stream
    await reader.decodeFromStream(activeStream, videoEl.value, (result) => {
      if (!result) return

      const raw = result.getText()
      const parsed = parseOrderFromQr(raw)

      if (!parsed?.placeNumber) {
        errorMsg.value = 'QR detected, but format is not supported.'
        return
      }

      if (parsed.orderType) orderType.value = parsed.orderType
      placeNumber.value = parsed.placeNumber

      closeScanner()

      if (customerName.value.trim().length >= 2) onContinue()
      else errorMsg.value = `${placeLabel.value} detected. Please enter your name to continue.`
    })
  } catch (e) {
    errorMsg.value =
      'Camera permission denied or camera not available. (Tip: must be HTTPS / Safari, not in-app browser)'
    closeScanner()
  }
}

function closeScanner() {
  scanning.value = false
  stopScanner()
}

function stopScanner() {
  // stop ZXing
  try {
    reader?.reset()
  } catch {}
  reader = null

  // stop camera tracks
  try {
    activeStream?.getTracks().forEach((t) => t.stop())
  } catch {}
  activeStream = null

  // clear video element
  try {
    if (videoEl.value) videoEl.value.srcObject = null
  } catch {}
}

function onContinue() {
  errorMsg.value = ''

  if (customerName.value.trim().length < 2) {
    errorMsg.value = 'Please enter your name.'
    return
  }

  if (!orderType.value) {
    errorMsg.value = 'Please select order type.'
    return
  }

  if (placeNumber.value.trim().length < 1) {
    errorMsg.value = `Please enter or scan your ${placeLabel.value.toLowerCase()}.`
    return
  }

  session.setSession({
    customerName: customerName.value,
    orderType: orderType.value,
    placeNumber: placeNumber.value,
  })

  const redirect = (route.query.redirect as string) || '/shop'
  router.replace(redirect)
}
</script>

<style scoped src="@/styles/customer/start-order.css"></style>
