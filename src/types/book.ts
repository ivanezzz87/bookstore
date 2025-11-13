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