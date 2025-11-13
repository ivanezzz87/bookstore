export interface User {
  id: string
  email: string
  name: string
  isAuthenticated: boolean
}

export interface AuthCredentials {
  email: string
  password: string
}