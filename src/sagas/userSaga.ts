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
import type { User, LoginResponse, SignupResponse } from '../types/user'
import { getUserInfoApi, loginApi, refreshTokenApi, signupApi } from '../helpers/api'
import type { RefreshTokenResponse, UserInfoResponse } from '../types/api'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* loginSaga(action: ReturnType<typeof loginStart>): Generator<any, void, any> {
  try {
    const tokens: LoginResponse = yield call(loginApi, action.payload)
    
    // Получаем информацию о пользователе
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