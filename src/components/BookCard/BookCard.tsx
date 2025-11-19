import React from 'react'
import styled from 'styled-components'
import type { BookCardProps } from '../../types/book'

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.borderDefault};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`

const ImageContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.md};
`

const BookImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const Overlay = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Card}:hover & {
    opacity: 1;
  }
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
      ? props.theme.colors.primary2
      : props.theme.colors.bwhite
  };
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`

const Content = styled.div`
  color: ${props => props.theme.colors.text.primary};
`

const Title = styled.h3`
  font-size: ${props => props.theme.typography.h3};
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Price = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.colors.primary};
`

const CartButton = styled.button<{ $active: boolean }>`
  background: ${props => 
    props.$active 
      ? props.theme.colors.secondary 
      : props.theme.colors.primary
  };
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: white;
  font-size: ${props => props.theme.typography.small};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: scale(1.05);
  }
`

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onBookClick,
  onAddToCart,
  onAddToBookmarks,
  isInCart = false,
  isInBookmarks = false
}) => {
  return (
    <Card>
      <ImageContainer>
        <BookImage 
          src={book.image} 
          alt={book.title}
          onClick={() => onBookClick(book.isbn13)}
        />
        <Overlay>
          <BookmarkButton 
            $active={isInBookmarks}
            onClick={() => onAddToBookmarks(book)}
            title={isInBookmarks ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            ♥
          </BookmarkButton>
        </Overlay>
      </ImageContainer>
      
      <Content>
        <Title onClick={() => onBookClick(book.isbn13)}>
          {book.title}
        </Title>
        <Subtitle>{book.subtitle}</Subtitle>
        <Footer>
          <Price>{book.price}</Price>
          <CartButton 
            $active={isInCart}
            onClick={() => onAddToCart(book)}
          >
            {isInCart ? '✓ In Cart' : '+ Add to Cart'}
          </CartButton>
        </Footer>
      </Content>
    </Card>
  )
}