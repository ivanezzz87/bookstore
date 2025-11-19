import { takeEvery, select, call, put } from 'redux-saga/effects'
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  restoreCart
} from '../store/cart/cartSlice'
import type { RootState } from '../store'

// Используем тип из store, а не из types/card
function* saveCartToLocalStorage() {
  const cart: RootState['cart'] = yield select((state: RootState) => state.cart)
  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

function* loadCartFromLocalStorage() {
  try {
    const cartStr: string | null = yield call([localStorage, 'getItem'], 'cart')
    if (cartStr) {
      const cart: RootState['cart'] = JSON.parse(cartStr)
      yield put(restoreCart(cart))
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }
}

export function* watchCartSaga(): Generator<unknown, void, unknown> {
  yield takeEvery([
    addToCart.type,
    removeFromCart.type,
    updateCartItemQuantity.type,
    clearCart.type
  ], saveCartToLocalStorage)
  
  yield call(loadCartFromLocalStorage)
}