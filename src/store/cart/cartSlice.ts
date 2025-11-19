import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { initialState, type CartItem, type CartState } from '../../types/card'
import type { Book } from '../../types/book'

const VAT_RATE = 0.15;

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.book.price.replace('$', '')) || 0
    return total + (price * item.quantity)
  }, 0)
}
const recalculateTotals = (state: CartState) => {
  state.total = calculateTotal(state.items)
  state.vat = state.total * VAT_RATE
  state.totalWithVat = state.total + state.vat
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Book>) => {
      const existingItem = state.items.find(item => item.book.isbn13 === action.payload.isbn13)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          book: action.payload,
          quantity: 1
        })
      }
      
      recalculateTotals(state)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.book.isbn13 !== action.payload)
      recalculateTotals(state)
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ isbn13: string; quantity: number }>) => {
      const item = state.items.find(item => item.book.isbn13 === action.payload.isbn13)
      if (item) {
        item.quantity = action.payload.quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.book.isbn13 !== action.payload.isbn13)
        }
      }
      recalculateTotals(state)
    },
        restoreCart: (state, action: PayloadAction<CartState>) => {
          state.items = action.payload.items
          recalculateTotals(state)
      return action.payload
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.vat = 0
      state.totalWithVat = 0
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart ,
  restoreCart
} = cartSlice.actions

export default cartSlice.reducer