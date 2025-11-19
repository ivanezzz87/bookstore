import type { Book } from "./book"

export interface AuthCredentials {
  email: string
  password: string
  username?: string
}

export interface User {
  id: string
  email: string
  username: string
  isAuthenticated: boolean
  access?: string
  refresh?: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface SignupResponse {
  id: string
  email: string
  username: string
}
export interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  bookmarks: Book[]
  accessToken: string | null
  refreshToken: string | null
}

export const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  bookmarks: [],
  accessToken: null,
  refreshToken: null
}