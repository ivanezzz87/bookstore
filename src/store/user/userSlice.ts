import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type User, type AuthCredentials, type LoginResponse, initialState } from '../../types/user'
import type { Book } from '../../types/book'

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state, action: PayloadAction<AuthCredentials>) => {
      state.loading = true
      state.error = null
      console.log(action.type)
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: LoginResponse }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      state.accessToken = action.payload.tokens.access
      state.refreshToken = action.payload.tokens.refresh
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
    },
    signupStart: (state, action: PayloadAction<AuthCredentials>) => {
      state.loading = true
      state.error = null
      console.log(action.type)
    },
    signupSuccess: (state, action: PayloadAction<{ user: User; tokens: LoginResponse }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      state.accessToken = action.payload.tokens.access
      state.refreshToken = action.payload.tokens.refresh
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.accessToken = null
      state.refreshToken = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.bookmarks = []
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    addToBookmarks: (state, action: PayloadAction<Book>) => {
      if (!state.bookmarks.find(book => book.isbn13 === action.payload.isbn13)) {
        state.bookmarks.push(action.payload)
      }
    },
    removeFromBookmarks: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(book => book.isbn13 !== action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
    refreshTokenSuccess: (state, action: PayloadAction<{ access: string }>) => {
      state.accessToken = action.payload.access
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  addToBookmarks,
  removeFromBookmarks,
  clearError,
  refreshTokenSuccess
} = userSlice.actions

export default userSlice.reducer