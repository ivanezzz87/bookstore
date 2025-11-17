/* eslint-disable @typescript-eslint/no-unused-vars */
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
export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken')
  return {
    'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    'Content-Type': 'application/json',
  }
}

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    // Токен истек, нужно обновить
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      try {
        const refreshResponse = await fetch('https://studapi.teachmeskills.by/auth/jwt/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken })
        })

        if (refreshResponse.ok) {
          const { access } = await refreshResponse.json()
          localStorage.setItem('accessToken', access)
          
          // Повторяем оригинальный запрос с новым токеном
          headers.Authorization = `Bearer ${access}`
          return fetch(url, { ...options, headers })
        }
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth'
      }
    }
  }

  return response
}