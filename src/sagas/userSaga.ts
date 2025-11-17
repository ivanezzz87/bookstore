/* eslint-disable @typescript-eslint/no-unused-vars */
import { call, put, takeEvery } from 'redux-saga/effects'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  refreshTokenSuccess
} from '../store/user/userSlice'
import type { AuthCredentials, User, LoginResponse, SignupResponse } from '../types/user'

const API_BASE_URL = 'https://studapi.teachmeskills.by'

// Типы для API ответов
interface UserInfoResponse {
  id: number
  email: string
  username: string
}

interface RefreshTokenResponse {
  access: string
}

// API calls
const loginApi = async (credentials: AuthCredentials): Promise<LoginResponse> => {
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

const signupApi = async (credentials: AuthCredentials): Promise<SignupResponse> => {
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

const getUserInfoApi = async (accessToken: string): Promise<UserInfoResponse> => {
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

const refreshTokenApi = async (refreshToken: string): Promise<RefreshTokenResponse> => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* loginSaga(action: ReturnType<typeof loginStart>): Generator<any, void, any> {
  try {
    const tokens: LoginResponse = yield call(loginApi, action.payload)
    
    // Получаем информацию о пользователе с правильной типизацией
    const userInfo: UserInfoResponse = yield call(getUserInfoApi, tokens.access)
    
    const user: User = {
      id: userInfo.id.toString(),
      email: userInfo.email,
      username: userInfo.username,
      isAuthenticated: true,
      access: tokens.access,
      refresh: tokens.refresh
    }

    yield put(loginSuccess({ user, tokens }))
    
    // Сохраняем в localStorage
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', tokens.access)
    localStorage.setItem('refreshToken', tokens.refresh)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(loginFailure(error?.message || 'Login failed'))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* signupSaga(action: ReturnType<typeof signupStart>): Generator<any, void, any> {
  try {
    // Создаем пользователя
    const signupResponse: SignupResponse = yield call(signupApi, action.payload)
    
    // Автоматически логиним пользователя после регистрации
    const tokens: LoginResponse = yield call(loginApi, {
      email: action.payload.email!,
      password: action.payload.password!
    })
    
    const user: User = {
      id: signupResponse.id.toString(),
      email: signupResponse.email,
      username: signupResponse.username,
      isAuthenticated: true,
      access: tokens.access,
      refresh: tokens.refresh
    }

    yield put(signupSuccess({ user, tokens }))
    
    // Сохраняем в localStorage
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', tokens.access)
    localStorage.setItem('refreshToken', tokens.refresh)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(signupFailure(error?.message || 'Registration failed'))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* refreshTokenSaga(): Generator<any, void, any> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      const tokens: RefreshTokenResponse = yield call(refreshTokenApi, refreshToken)
      yield put(refreshTokenSuccess(tokens))
      localStorage.setItem('accessToken', tokens.access)
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    // Если refresh не удался, разлогиниваем пользователя
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* checkAuthSaga(): Generator<any, void, any> {
  try {
    const userStr = localStorage.getItem('user')
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (userStr && accessToken && refreshToken) {
      const user: User = JSON.parse(userStr)
      
      // Проверяем валидность токена
      try {
        const userInfo: UserInfoResponse = yield call(getUserInfoApi, accessToken)
        
        // Обновляем информацию о пользователе
        const updatedUser: User = {
          ...user,
          email: userInfo.email,
          username: userInfo.username
        }
        
        yield put(loginSuccess({ 
          user: updatedUser, 
          tokens: { access: accessToken, refresh: refreshToken } 
        }))
      } catch (error) {
        // Если токен истек, пытаемся обновить
        yield call(refreshTokenSaga)
      }
    }
  } catch (error) {
    console.error('Failed to check auth:', error)
  }
}

export function* watchUserSaga() {
  yield takeEvery(loginStart.type, loginSaga)
  yield takeEvery(signupStart.type, signupSaga)
  yield call(checkAuthSaga)
}