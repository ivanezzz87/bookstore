import type { Book, BookDetails, BooksResponse } from '../types/book'

const API_BASE = 'https://api.itbook.store/1.0'

export const getNewReleases = async (): Promise<Book[]> => {
  const response = await fetch(`${API_BASE}/new`)
  const data = await response.json()
  return data.books
}

export const searchBooks = async (query: string, page: number = 1): Promise<BooksResponse> => {
  const response = await fetch(`${API_BASE}/search/${query}?page=${page}`)
  return response.json()
}

export const getBookDetails = async (isbn13: string): Promise<BookDetails> => {
  const response = await fetch(`${API_BASE}/books/${isbn13}`)
  return response.json()
}