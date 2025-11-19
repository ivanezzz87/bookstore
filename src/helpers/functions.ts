import type { ApiError } from "../types/api";

export const currentYear = new Date().getFullYear();

export const createApiError = (message: string, status?: number, statusText?: string): ApiError => {
  const error = new Error(message) as ApiError
  error.status = status
  error.statusText = statusText
  return error
}
// Проверка статуса ответа
export const checkResponse = async (response: Response): Promise<void> => {
  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.detail || errorMessage
    } catch {
      // Если не удалось распарсить JSON, используем стандартное сообщение
    }
    
    throw createApiError(errorMessage, response.status, response.statusText)
  }
}
//Получение из storage токена
export const getAuthHeaders = (): HeadersInit => {
  const accessToken = localStorage.getItem('accessToken')
  return {
    'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    'Content-Type': 'application/json',
  }
}