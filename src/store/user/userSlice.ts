import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User, AuthCredentials} from '../../types/user'
import type { Book } from '../../types/book'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  bookmarks: Book[]
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  bookmarks: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state, action: PayloadAction<AuthCredentials>) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    signupStart: (state, action: PayloadAction<AuthCredentials>) => {
      state.loading = true
      state.error = null
    },
    signupSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.bookmarks = []
      localStorage.removeItem('user')
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
  clearError
} = userSlice.actions

export default userSlice.reducer