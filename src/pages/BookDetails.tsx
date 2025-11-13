import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { fetchBookDetailsStart } from '../store/books/bookSlice'
import { addToCart } from '../store/cart/cartSlice'
import { addToBookmarks, removeFromBookmarks } from '../store/user/userSlice'
import BookmarkActiveIcon from '../assets/BookmarkActive.svg'
import BookmarkIcon from '../assets/BookmarkDefault.svg'
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`

const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  background-color: ${props => props.theme.colors.bgrey};
`

const BookImage = styled.img`
  object-fit: cover;
  width: 100%;
  border-radius: ${props => props.theme.borderRadius.lg};
`
const Overlay = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  transition: opacity 0.3s ease;

`
const BookmarkButton = styled.button<{ $active: boolean }>`
  background: rgba(30, 30, 30, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => 
    props.$active 
      ? props.theme.colors.secondary 
      : props.theme.colors.text.secondary
  };
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`
const InfoSection = styled.div`
  color: ${props => props.theme.colors.text.primary};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1};
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.3;
`

const Subtitle = styled.h2`
  font-size: ${props => props.theme.typography.h2};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  font-weight: 400;
  line-height: 1.4;
`

const MetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.bwhite};
  border-radius: ${props => props.theme.borderRadius.md};
`

const MetaLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  min-width: 100px;
`

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.bwhite};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Price = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`

const ActionButton = styled.button<{ $variant: 'bookmark' | 'cart'; $active: boolean }>`
  background: ${props => {
    if (props.$active) return props.theme.colors.secondary
    return props.$variant === 'bookmark' 
      ? 'transparent' 
      : props.theme.colors.primary
  }};
  border: ${props => 
    props.$variant === 'bookmark' && !props.$active
      ? `1px solid ${props.theme.colors.primary}`
      : 'none'
  };
  color: ${props => 
    props.$active ? 'white' : props.theme.colors.primary
  };
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => 
      props.$variant === 'bookmark' 
        ? props.theme.colors.primary
        : props.theme.colors.secondary
  }};
  color: white;
`

const Description = styled.div`
  background: ${props => props.theme.colors.bwhite};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.borderDefault};
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  p {
    line-height: 1.6;
    color: ${props => props.theme.colors.text.secondary};
  }
`

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${props => props.theme.typography.h3};
  color: ${props => props.theme.colors.text.secondary};
`

const Error = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${props => props.theme.typography.h3};
  color: ${props => props.theme.colors.error};
`

export const BookDetails: React.FC = () => {
  const { isbn13 } = useParams<{ isbn13: string }>()
  const dispatch = useDispatch()
  const { currentBook, loading, error } = useSelector((state: RootState) => state.books)
  const { bookmarks } = useSelector((state: RootState) => state.user)
  const { items: cartItems } = useSelector((state: RootState) => state.cart)

  const isInBookmarks = bookmarks.some(book => book.isbn13 === currentBook?.isbn13)
  const isInCart = cartItems.some(item => item.book.isbn13 === currentBook?.isbn13)

  useEffect(() => {
    if (isbn13) {
      dispatch(fetchBookDetailsStart(isbn13))
    }
  }, [dispatch, isbn13])

  const handleAddToBookmarks = () => {
    if (currentBook) {
      if (isInBookmarks) {
        dispatch(removeFromBookmarks(currentBook.isbn13))
      } else {
        dispatch(addToBookmarks(currentBook))
      }
    }
  }

  const handleAddToCart = () => {
    if (currentBook) {
      dispatch(addToCart(currentBook))
    }
  }

  if (loading) return <Loading>Loading book details...</Loading>
  if (error) return <Error>Error: {error}</Error>
  if (!currentBook) return <div>Book not found</div>

  return (
    <Container>
      <DetailsGrid>
        <ImageSection>
          <BookImage 
            src={currentBook.image} 
            alt={currentBook.title}

          />
            <Overlay>
              <BookmarkButton
                $active={isInBookmarks}
                onClick={handleAddToBookmarks}
              >
                {isInBookmarks ? <img src={BookmarkActiveIcon} alt="" /> : <img src={BookmarkIcon} alt="" />}
              </BookmarkButton>
          </Overlay>
        </ImageSection>
        
        <InfoSection>
          <Title>{currentBook.title}</Title>
          <Subtitle>{currentBook.subtitle}</Subtitle>
          
          <MetaGrid>
            <MetaItem>
              <MetaLabel>Authors</MetaLabel>
              <span>{currentBook.authors}</span>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Publisher</MetaLabel>
              <span>{currentBook.publisher}</span>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Pages</MetaLabel>
              <span>{currentBook.pages}</span>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Year</MetaLabel>
              <span>{currentBook.year}</span>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Rating</MetaLabel>
              <span>⭐ {currentBook.rating}</span>
            </MetaItem>
          </MetaGrid>

          <PriceSection>
            <Price>{currentBook.price}</Price>
            <Actions>
              <ActionButton 
                $variant="bookmark"
                $active={isInBookmarks}
                onClick={handleAddToBookmarks}
              >
                {isInBookmarks ? '♥ Remove from Bookmarks' : '♥ Add to Bookmarks'}
              </ActionButton>
              <ActionButton 
                $variant="cart"
                $active={isInCart}
                onClick={handleAddToCart}
              >
                {isInCart ? '✓ Added to Cart' : '+ Add to Cart'}
              </ActionButton>
            </Actions>
          </PriceSection>
        </InfoSection>
            <Description>
            <h3>Description</h3>
            <p>{currentBook.desc}</p>
          </Description>
      </DetailsGrid>
    </Container>
  )
}