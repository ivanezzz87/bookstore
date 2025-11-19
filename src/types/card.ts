import type { Book } from "./book"

export interface CartItem {
  book: Book
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  vat: number
  totalWithVat: number
}

export const initialState: CartState = {
  items: [],
  total: 0,
  vat: 0,
  totalWithVat: 0
}