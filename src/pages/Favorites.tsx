import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { RootState } from '../store'
import { removeFromBookmarks } from '../store/user/userSlice'

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  min-height: 80vh;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1};
  text-transform: uppercase;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 700;
`

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`

const FavoriesContent = styled.div`
  width: 80%;
  display: grid;
  gap: ${props => props.theme.spacing.xl};
`

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderDefault};
  background: white;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

const Cover = styled.img`
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
`

const BookTitle = styled.h3`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  color: ${props => props.theme.colors.text.primary};
`

const BookSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text.secondary};
`

const BookPrice = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 1.1rem;
`

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 600;

  &:hover {
    opacity: 0.88;
  }
`

const RemoveButton = styled(Button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => props.theme.colors.bwhite};
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  height: fit-content;
  
  &:hover {
    font-weight: 600;
  }
`

const EmptyState = styled.div`
  padding: 100px 20px;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const EmptyTitle = styled.h2`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const ContinueButton = styled(Button)`
  max-width: 240px;
  background: ${props => props.theme.colors.primary};
  color: white;
  margin: 0 auto;
`

export const Favorites: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const favorites = useSelector((state: RootState) => state.user.bookmarks)

  const handleRemove = (isbn13: string) => {
    dispatch(removeFromBookmarks(isbn13))
  }

  const handleViewDetails = (isbn13: string) => {
    navigate(`/books/${isbn13}`)
  }

  const handleContinue = () => {
    navigate('/')
  }

  if (favorites.length === 0) {
    return (
      <PageContainer>
        <Header>
          <Title>Favourites</Title>
          <Subtitle>Here will appear the books you add to favourites.</Subtitle>
        </Header>

        <EmptyState>
          <EmptyIcon>⭐</EmptyIcon>
          <EmptyTitle>No favourites yet</EmptyTitle>
          <EmptyText>Save books you like to compare or buy later.</EmptyText>
          <ContinueButton onClick={handleContinue}>
            Back to shop
          </ContinueButton>
        </EmptyState>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header>
        <Title>Favorites</Title>
        <Subtitle>You have {favorites.length} book(s) in favourites.</Subtitle>
      </Header>

      <FavoriesContent>
        {favorites.map(book => (
          <Card key={book.isbn13}>
            <Cover 
              src={book.image} 
              alt={book.title}
              onClick={() => handleViewDetails(book.isbn13)}
            />
            <CardInfo>
              <BookTitle>{book.title}</BookTitle>
              {book.subtitle && <BookSubtitle>{book.subtitle}</BookSubtitle>}
              <BookPrice>{book.price}</BookPrice>
            </CardInfo>
            <CardActions>
              <RemoveButton onClick={() => handleRemove(book.isbn13)}>
                X
              </RemoveButton>
            </CardActions>
          </Card>
        ))}
      </FavoriesContent>
    </PageContainer>
  )
}