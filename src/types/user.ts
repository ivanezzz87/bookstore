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