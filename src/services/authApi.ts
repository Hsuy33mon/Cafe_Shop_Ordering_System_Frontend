// src/services/authApi.ts
import type { LoginRequestDto, LoginResponseDto } from '@/dtos/auth/LoginDto'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function loginApi(payload: LoginRequestDto): Promise<LoginResponseDto> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let msg = `Login failed (${res.status})`
    try {
      const data = await res.json()
      msg = data?.message || data?.error || msg
    } catch {}
    throw new Error(msg)
  }

  return res.json()
}
