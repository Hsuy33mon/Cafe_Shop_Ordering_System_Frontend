export type LoginRequestDto = {
  email: string
  password: string
}

export type LoginResponseDto = {
  accessToken?: string
  token?: string
  refreshToken?: string
  user?: any
}
