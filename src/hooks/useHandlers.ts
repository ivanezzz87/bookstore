import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../store'
import type { Book } from '../types/book'
import { addToCart } from '../store/cart/cartSlice'
import { addToBookmarks, removeFromBookmarks } from '../store/user/userSlice'
import { fetchNewReleasesStart } from '../store/books/bookSlice'

export const useBookstoreHandlers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const { bookmarks } = useSelector((state: RootState) => state.user)
  const { items: cartItems } = useSelector((state: RootState) => state.cart)

  const handleBookClick = useCallback((isbn13: string) => {
    navigate(`/book/${isbn13}`)
  }, [navigate])

  const handleAddToCart = useCallback((book: Book) => {
    dispatch(addToCart(book))
  }, [dispatch])

  const handleAddToBookmarks = useCallback((book: Book) => {
    const isBookmarked = bookmarks.some(b => b.isbn13 === book.isbn13)
    if (isBookmarked) {
      dispatch(removeFromBookmarks(book.isbn13))
    } else {
      dispatch(addToBookmarks(book))
    }
  }, [dispatch, bookmarks])

  const handleRemoveFromBookmarks = useCallback((book: Book) => {
    dispatch(removeFromBookmarks(book.isbn13))
  }, [dispatch])

  const handleRetry = useCallback(() => {
    dispatch(fetchNewReleasesStart())
  }, [dispatch])

  const handleContinue = () => {
    navigate('/')
  }

    const handleBack = () => {
    navigate(-1)
  }

  const isBookInBookmarks = useCallback((book: Book): boolean => {
    return bookmarks.some(b => b.isbn13 === book.isbn13)
  }, [bookmarks])

  const isBookInCart = useCallback((book: Book): boolean => {
    return cartItems.some(item => item.book.isbn13 === book.isbn13)
  }, [cartItems])

  return {
    handleContinue,
    handleBack,
    handleBookClick,
    handleAddToCart,
    handleAddToBookmarks,
    handleRemoveFromBookmarks,
    handleRetry,
    isBookInBookmarks,
    isBookInCart
  }
}