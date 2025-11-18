// pages/Home/Home.tsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { BookCard } from '../components/BookCard/BookCard'
import { Pagination } from '../components/Pagination/Pagination'
import { fetchNewReleasesStart } from '../store/books/bookSlice'
import type { RootState } from '../store'
import { useBookstoreHandlers } from '../hooks/useHandlers'
const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1};
  text-transform: uppercase;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: 700;
`

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.md};
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.borderDefault};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.p`
  font-size: ${props => props.theme.typography.body};
  color: ${props => props.theme.colors.text.secondary};
`

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.error};
`

const ErrorText = styled.p`
  font-size: ${props => props.theme.typography.body};
  color: ${props => props.theme.colors.text.secondary};
  max-width: 400px;
`

const RetryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.small};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.text.secondary};
`

const EmptyText = styled.p`
  font-size: ${props => props.theme.typography.body};
  color: ${props => props.theme.colors.text.secondary};
`

export const Home: React.FC = () => {
  const dispatch = useDispatch()
  const {
    handleBookClick,
    handleAddToCart,
    handleAddToBookmarks,
    handleRetry,
    isBookInBookmarks,
    isBookInCart
  } = useBookstoreHandlers()
  const { 
    newReleases, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.books)
  
  useSelector((state: RootState) => state.user)
  useSelector((state: RootState) => state.cart)
  
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 9 

  useEffect(() => {
    dispatch(fetchNewReleasesStart())
  }, [dispatch])

  // Вычисляем книги для текущей страницы
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = newReleases.slice(indexOfFirstBook, indexOfLastBook)

  const totalPages = Math.ceil(newReleases.length / booksPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Прокрутка к верху страницы при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Сбрасываем на первую страницу при изменении данных
  useEffect(() => {
    setCurrentPage(1)
  }, [newReleases])

  // Loading state
  if (loading) {
    return (
      <HomeContainer>
        <Header>
          <Title>New Releases Books</Title>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading new releases...</LoadingText>
        </LoadingContainer>
      </HomeContainer>
    )
  }

  // Error state
  if (error) {
    return (
      <HomeContainer>
        <Header>
          <Title>New Releases Books</Title>
        </Header>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>
            We encountered an error while loading new releases. Please try again.
          </ErrorText>
          <RetryButton onClick={handleRetry}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      </HomeContainer>
    )
  }

  // Empty state
  if (!newReleases || newReleases.length === 0) {
    return (
      <HomeContainer>
        <Header>
          <Title>New Releases Books</Title>
        </Header>
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyText>
            No new releases found at the moment. Please check back later.
          </EmptyText>
        </EmptyState>
      </HomeContainer>
    )
  }

  // Success state
  return (
    <HomeContainer>
      <Header>
        <Title>New Releases Books</Title>
      </Header>
      
      <BooksGrid>
        {currentBooks.map(book => (
          <BookCard
            key={book.isbn13}
            book={book}
            onBookClick={handleBookClick}
            onAddToCart={handleAddToCart}
            onAddToBookmarks={handleAddToBookmarks}
            isInCart={isBookInCart(book)}
            isInBookmarks={isBookInBookmarks(book)}
          />
        ))}
      </BooksGrid>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showNavigation={true}
      />
    </HomeContainer>
  )
}
