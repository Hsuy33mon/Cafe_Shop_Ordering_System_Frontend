<template>
  <main class="start-wrap">
    <section class="start-card">
      <header class="start-head">
        <p class="start-kicker">WELCOME TO CAFESHOP</p>
        <h1 class="start-title">Start your order</h1>
        <p class="start-sub">
          {{
            isMobile
              ? 'Scan your table QR to continue.'
              : 'Enter your name and table number to continue.'
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
        <div v-if="!isMobile" class="desktop-area">
          <div class="field">
            <label class="label" for="table">Table number</label>
            <input
              id="table"
              v-model="tableNumber"
              class="input"
              type="text"
              inputmode="numeric"
              placeholder="e.g. 12"
              maxlength="10"
              required
            />
            <p class="hint">Tip: use the QR on your table, or type the number.</p>
          </div>

          <div class="actions">
            <button class="btn btn-primary" type="submit" :disabled="!canContinueDesktop">
              Next
            </button>
          </div>
        </div>

        <!-- MOBILE: scan-first -->
        <div v-else class="mobile-area">
          <button type="button" class="btn btn-primary" @click="openScanner">Scan table QR</button>

          <button type="button" class="btn btn-ghost" @click="toggleManual">
            {{ manualMode ? 'Hide manual entry' : 'Enter table number manually' }}
          </button>

          <div v-if="manualMode" class="field mt-10">
            <label class="label" for="tableMobile">Table number</label>
            <input
              id="tableMobile"
              v-model="tableNumber"
              class="input"
              type="text"
              inputmode="numeric"
              placeholder="e.g. 12"
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
                <p class="modal-title">Scan table QR</p>
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
              <video ref="videoEl" class="video" playsinline muted></video>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { useOrderSessionStore } from '@/stores/orderSession'

const router = useRouter()
const route = useRoute()
const session = useOrderSessionStore()
session.hydrate()

const customerName = ref(session.customerName || '')
const tableNumber = ref(session.tableNumber || '')

const errorMsg = ref('')
const manualMode = ref(false)

const scanning = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)
let reader: BrowserMultiFormatReader | null = null

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

  if (!hasRedirect) {
    session.clear()
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  stopScanner()
})
const canContinueDesktop = computed(
  () => customerName.value.trim().length >= 2 && tableNumber.value.trim().length >= 1,
)
const canContinueMobile = computed(
  () => customerName.value.trim().length >= 2 && tableNumber.value.trim().length >= 1,
)

function toggleManual() {
  errorMsg.value = ''
  manualMode.value = !manualMode.value
}

function parseTableFromQr(text: string): string | null {
  const t = text.trim()

  const m1 = t.match(/TABLE\s*:\s*([A-Za-z0-9-]+)/i)
  if (m1?.[1]) return m1[1]

  const m2 = t.match(/(?:\?|&)table=([A-Za-z0-9-]+)/i)
  if (m2?.[1]) return m2[1]

  const m3 = t.match(/^([A-Za-z0-9-]{1,10})$/)
  if (m3?.[1]) return m3[1]

  return null
}

async function openScanner() {
  errorMsg.value = ''
  scanning.value = true

  if (!videoEl.value) return

  reader = new BrowserMultiFormatReader()

  try {
    const devices = await BrowserMultiFormatReader.listVideoInputDevices()
    const deviceId = devices?.[0]?.deviceId

    await reader.decodeFromVideoDevice(deviceId, videoEl.value, (result) => {
      if (!result) return

      const raw = result.getText()
      const parsed = parseTableFromQr(raw)

      if (!parsed) {
        errorMsg.value = 'QR detected, but table number format is not supported.'
        return
      }

      tableNumber.value = parsed
      closeScanner()
      if (customerName.value.trim().length >= 2) {
        onContinue()
      } else {
        errorMsg.value = 'Table detected. Please enter your name to continue.'
      }
    })
  } catch {
    errorMsg.value = 'Camera permission denied or camera not available.'
    closeScanner()
  }
}

function closeScanner() {
  scanning.value = false
  stopScanner()
}

function stopScanner() {
  try {
    reader?.reset()
  } catch {}
  reader = null
}

function onContinue() {
  errorMsg.value = ''

  if (customerName.value.trim().length < 2) {
    errorMsg.value = 'Please enter your name.'
    return
  }

  // Desktop requires table, Mobile: if scanning used, table should already be set
  if (tableNumber.value.trim().length < 1) {
    errorMsg.value = 'Please enter or scan your table number.'
    return
  }

  session.setSession({
    customerName: customerName.value,
    tableNumber: tableNumber.value,
  })

  const redirect = (route.query.redirect as string) || '/shop'
  router.replace(redirect)
}
</script>

<style scoped src="@/styles/customer/start-order.css"></style>
