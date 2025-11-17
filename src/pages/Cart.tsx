import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} from '../store/cart/cartSlice'
import type { RootState } from '../store'

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  min-height: 80vh;
  position: relative;
`

const CartHeader = styled.div`
  text-align: left;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const CartTitle = styled.h1`
  font-size: ${props => props.theme.typography.h1};
  text-transform: uppercase;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: 700;
`

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const CartItemCard = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderDefault};
  background: white;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const BookCover = styled.img`
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  flex-shrink: 0;
`

const BookInfo = styled.div`
  flex: 1;
`

const BookTitle = styled.h3`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  margin: 0 0 ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: 600;
`

const BookAuthor = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.md};
`

const BookPrice = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityInput = styled.input`
  width: 60px;
  height: 36px;
  border: none;
  text-align: center;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const RemoveButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => props.theme.colors.bwhite};
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  
  &:hover {
  font-weight: 600;
  }
`
const CartSummaryContainer = styled.div`
  width: 100%;
  position: relative;
`

const CartSummary = styled.div`
  width: 30%;
  background: ${props => props.theme.colors.bwhite};
  padding: ${props => props.theme.spacing.lg};
  height: fit-content;
  border-radius: ${props => props.theme.borderRadius.md};
  position: absolute;
  top: 100%;
  right: 0;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.borderDefault};
  
  &:last-child {
    border-bottom: none;
    font-weight: 700;
  }
`
const SummaryTotal = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.lg};
`
const CheckoutButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-size: 1.2rem;
  font-family: 'Bebas Neue', sans-serif;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 700;
  margin-top: ${props => props.theme.spacing.xs};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`

const ContinueShoppingButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: ${props => props.theme.spacing.md};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${props => props.theme.colors.text.secondary};
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const EmptyTitle = styled.h2`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const EmptyText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.xl};
`

export const Cart: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { items, total, vat, totalWithVat } = useSelector((state: RootState) => state.cart)

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updateCartItemQuantity({ isbn13: bookId, quantity: newQuantity }));
  }

  const handleRemoveItem = (bookId: string) => {
    dispatch(removeFromCart(bookId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleContinueShopping = () => {
    navigate('/')
  }

  const handleCheckout = () => {
    // Здесь можно добавить логику оформления заказа
    console.log('Proceed to checkout')
  }

  const calculateItemTotal = (price: string, quantity: number): string => {
    const priceNum = parseFloat(price.replace('$', '')) || 0
    return `$${(priceNum * quantity).toFixed(2)}
    `
  }
  if (items.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <CartTitle>Your Cart</CartTitle>
        </CartHeader>
        <EmptyCart>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyTitle>Empty Cart</EmptyTitle>
          <EmptyText>
            Add boks to your cart to see them here.
          </EmptyText>
          <ContinueShoppingButton onClick={handleContinueShopping}>
            Continue Shopping
          </ContinueShoppingButton>
        </EmptyCart>
      </CartContainer>
    )
  }

  return (
    <CartContainer>
      <CartHeader>
        <CartTitle>Your Cart</CartTitle>
      </CartHeader>

      <CartContent>
        <div>
          <CartItems>
            {items.map((item) => (
              <CartItemCard key={item.book.isbn13}>
                <BookCover
                  src={item.book.image}
                  alt={item.book.title}
                />
                <BookInfo>
                  <BookTitle>{item.book.title}</BookTitle>
                    {item.book.subtitle && <BookAuthor>{item.book.subtitle}</BookAuthor>}     
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => handleQuantityChange(item.book.isbn13, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput
                  type="number"
                  value={item.quantity}
                  onChange={(e) => 
                      handleQuantityChange(item.book.isbn13, parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.book.isbn13, item.quantity + 1)}
                >
                  +
                </QuantityButton>
                </QuantityControls>
              </BookInfo>
              <BookPrice>{item.book.price}</BookPrice>
                  <RemoveButton onClick={() => handleRemoveItem(item.book.isbn13)}>
                    X
                  </RemoveButton>
            </CartItemCard>
          ))}
        </CartItems>
        </div>
      </CartContent>
      <CartSummaryContainer>
          <CartSummary>
          
          <SummaryRow>
            <span>Sum total:</span>
            <span>${total.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>VAT:</span>
            <span>${vat.toFixed(2)}</span>
          </SummaryRow>
          <SummaryTotal>
            <span>Total:</span>
            <span>${(totalWithVat).toFixed(2)}</span>
          </SummaryTotal>
          <CheckoutButton onClick={handleCheckout}>
            Check out
          </CheckoutButton>
          
          <CheckoutButton onClick={handleClearCart}>
            Clean Cart
          </CheckoutButton>
        </CartSummary>
      </CartSummaryContainer>
    </CartContainer>
    
  )
}