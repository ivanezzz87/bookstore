// store/books/bookSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Book, BookDetails, BooksResponse } from '../../types/book'

interface BooksState {
  newReleases: Book[]
  searchResults: Book[]
  currentBook: BookDetails | null
  loading: boolean
  error: string | null
  searchQuery: string
  totalPages: number
  currentPage: number
}

const initialState: BooksState = {
  newReleases: [],
  searchResults: [],
  currentBook: null,
  loading: false,
  error: null,
  searchQuery: '',
  totalPages: 0,
  currentPage: 1
}

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    fetchNewReleasesStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchNewReleasesSuccess: (state, action: PayloadAction<Book[]>) => {
      state.newReleases = action.payload
      state.loading = false
    },
    fetchNewReleasesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    searchBooksStart: (state, action: PayloadAction<{ query: string; page?: number }>) => {
      state.loading = true
      state.error = null
      state.searchQuery = action.payload.query
      state.currentPage = action.payload.page || 1
    },
    searchBooksSuccess: (state, action: PayloadAction<BooksResponse>) => {
      state.searchResults = action.payload.books || []
      // API возвращает total, но не возвращает totalPages, поэтому вычисляем
      const totalItems = parseInt(action.payload.total) || 0
      state.totalPages = Math.ceil(totalItems / 10) // Ваш API возвращает по 10 книг на страницу
      state.loading = false
    },
    searchBooksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchQuery = ''
      state.currentPage = 1
      state.totalPages = 0
    },
    fetchBookDetailsStart: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    fetchBookDetailsSuccess: (state, action: PayloadAction<BookDetails>) => {
      state.currentBook = action.payload
      state.loading = false
    },
    fetchBookDetailsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const {
  fetchNewReleasesStart,
  fetchNewReleasesSuccess,
  fetchNewReleasesFailure,
  searchBooksStart,
  searchBooksSuccess,
  searchBooksFailure,
  setCurrentPage,
  clearSearchResults,
  fetchBookDetailsStart,
  fetchBookDetailsSuccess,
  fetchBookDetailsFailure
} = booksSlice.actions

export default booksSlice.reducer