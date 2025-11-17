import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store'
import { 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} from '../store/cart/cartSlice'

export const useCartHandlers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const { items, total, vat, totalWithVat } = useSelector((state: RootState) => state.cart)

  const handleQuantityChange = useCallback((bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updateCartItemQuantity({ isbn13: bookId, quantity: newQuantity }))
  }, [dispatch])

  const handleRemoveItem = useCallback((bookId: string) => {
    dispatch(removeFromCart(bookId))
  }, [dispatch])

  const handleClearCart = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  const handleContinueShopping = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleCheckout = useCallback(() => {
    console.log('Proceed to checkout')

  }, [])

  const handleViewDetails = useCallback((isbn13: string) => {
    navigate(`/book/${isbn13}`)
  }, [navigate])

  return {
    // Обработчики
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    handleContinueShopping,
    handleCheckout,
    handleViewDetails,
    
    // Данные корзины
    cartItems: items,
    cartTotal: total,
    cartVat: vat,
    cartTotalWithVat: totalWithVat,
    
    // Вспомогательные данные
    isCartEmpty: items.length === 0
  }
}