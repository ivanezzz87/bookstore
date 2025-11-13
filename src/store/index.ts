import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import booksReducer from './books/bookSlice'
import userReducer from './user/userSlice'
import cartReducer from './cart/cartSlice'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    books: booksReducer,
    user: userReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch