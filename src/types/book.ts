export interface Book {
  title: string
  subtitle: string
  isbn13: string
  price: string
  image: string
  url: string
}

export interface BookDetails extends Book {
  authors: string
  publisher: string
  pages: string
  year: string
  rating: string
  desc: string
  language: string
  format: string
  pdf?: {
    [key: string]: string
  }
}

export interface BooksResponse {
  error: string
  total: string
  page: string
  books: Book[]
}

  export interface BookCardProps {
  book: Book
  onBookClick: (isbn13: string) => void
  onAddToCart: (book: Book) => void
  onAddToBookmarks: (book: Book) => void
  isInCart?: boolean
  isInBookmarks?: boolean
}
export interface BooksState {
  newReleases: Book[]
  searchResults: Book[]
  currentBook: BookDetails | null
  loading: boolean
  error: string | null
  searchQuery: string
  totalPages: number
  currentPage: number
}

export const initialState: BooksState = {
  newReleases: [],
  searchResults: [],
  currentBook: null,
  loading: false,
  error: null,
  searchQuery: '',
  totalPages: 0,
  currentPage: 1
}