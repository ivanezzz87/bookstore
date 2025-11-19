export interface ApiError extends Error {
  status?: number
  statusText?: string
}
export interface RefreshTokenResponse {
  access: string
}
// Типы для API ответов
export interface UserInfoResponse {
  id: number
  email: string
  username: string
}
