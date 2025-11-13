import type { Book } from "./book"

export interface CartItem {
  book: Book
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
}