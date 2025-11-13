import { call, put, takeEvery } from 'redux-saga/effects'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure} from '../store/user/userSlice'
import type { AuthCredentials, User } from '../types/user'

// Mock API calls - в реальном приложении заменить на реальные API вызовы
const mockLoginApi = (credentials: AuthCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        resolve({
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          isAuthenticated: true
        })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 1000)
  })
}

const mockSignupApi = (credentials: AuthCredentials): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        isAuthenticated: true
      })
    }, 1000)
  })
}

function* loginSaga(action: ReturnType<typeof loginStart>) {
  try {
    const user: User = yield call(mockLoginApi, action.payload)
    yield put(loginSuccess(user))
    // Сохраняем пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : 'Login failed'))
  }
}

function* signupSaga(action: ReturnType<typeof signupStart>) {
  try {
    const user: User = yield call(mockSignupApi, action.payload)
    yield put(signupSuccess(user))
    // Сохраняем пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    yield put(signupFailure(error instanceof Error ? error.message : 'Signup failed'))
  }
}

function* checkAuthSaga() {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user: User = JSON.parse(userStr)
      yield put(loginSuccess(user))
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