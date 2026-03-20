import { ref, computed, onMounted } from 'vue'
import { http } from '@/lib/http'

export function useVat(totalRef: any) {
  const vatRate = ref(0)
  const vatType = ref<'PERCENTAGE' | 'FIXED'>('PERCENTAGE')
  const loading = ref(false)

  async function fetchVat() {
    loading.value = true
    try {
      const res = await http.get('/api/admin/vats/default', { skipAuth: true })
      vatRate.value = res.data.vatRate
      vatType.value = res.data.taxType
    } catch (e) {
      console.error('Failed to load VAT', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchVat)

  function round2(n: number) {
  return Math.round(n * 100) / 100
}

const vatAmount = computed(() => {
  if (vatType.value === 'PERCENTAGE') {
    return round2((totalRef.value * vatRate.value) / 100)
  } else {
    return vatRate.value
  }
})

const grandTotal = computed(() => {
  return round2(totalRef.value + vatAmount.value)
})

  return {
    vatRate,
    vatType,
    vatAmount,
    grandTotal,
    loading,
    fetchVat,
  }
}
