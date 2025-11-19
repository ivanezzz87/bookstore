/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RefreshTokenResponse, UserInfoResponse } from '../types/api'
import type { Book, BookDetails, BooksResponse } from '../types/book'
import type { AuthCredentials, LoginResponse, SignupResponse } from '../types/user'
import { checkResponse, createApiError, getAuthHeaders } from './functions'

const API_BASE = 'https://api.itbook.store/1.0'
const API_BASE_URL = 'https://studapi.teachmeskills.by'
// Получаем новые релизы
export const getNewReleases = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_BASE}/new`)
    await checkResponse(response)
    
    const data = await response.json()
    
    if (!data.books || !Array.isArray(data.books)) {
      throw createApiError('Invalid response format: books array not found')
    }
    
    return data.books
  } catch (error) {
    console.error('Failed to fetch new releases:', error)
    throw error instanceof Error ? error : createApiError('Failed to fetch new releases')
  }
}

export const searchBooks = async (query: string, page: number = 1): Promise<BooksResponse> => {
  if (!query || query.trim().length === 0) {
    throw createApiError('Search query cannot be empty')
  }

  if (page < 1) {
    throw createApiError('Page number must be greater than 0')
  }

  try {
    const response = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}?page=${page}`)
    await checkResponse(response)
    
    return await response.json()
  } catch (error) {
    console.error(`Failed to search books with query "${query}":`, error)
    throw error instanceof Error ? error : createApiError('Failed to search books')
  }
}

export const getBookDetails = async (isbn13: string): Promise<BookDetails> => {
  if (!isbn13 || isbn13.trim().length === 0) {
    throw createApiError('ISBN13 cannot be empty')
  }

  try {
    const response = await fetch(`${API_BASE}/books/${isbn13}`)
    await checkResponse(response)
    
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch book details for ISBN13 "${isbn13}":`, error)
    throw error instanceof Error ? error : createApiError('Failed to fetch book details')
  }
}

// API
export const loginApi = async (credentials: AuthCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || 'Login failed')
  }

  return response.json()
}

export const signupApi = async (credentials: AuthCredentials): Promise<SignupResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    const errorMessage = Object.values(errorData).flat().join(', ') || 'Registration failed'
    throw new Error(errorMessage)
  }

  return response.json()
}

export const getUserInfoApi = async (accessToken: string): Promise<UserInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    throw new Error('Failed to get user info')
  }

  return response.json()
}

export const refreshTokenApi = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/jwt/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken })
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  return response.json()
}