import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { BookCard } from '../components/BookCard/BookCard'
import { Pagination } from '../components/Pagination/Pagination'
import { 
  searchBooksStart,
  searchBooksSuccess,
  searchBooksFailure,
  setCurrentPage,
} from '../store/books/bookSlice'
import { searchBooks } from '../helpers/api'
import type { RootState } from '../store'
import { useBookstoreHandlers } from '../hooks/useHandlers'

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  min-height: 80vh;
`

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const ResultsInfo = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing.xl} 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.h2};
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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
  height: 200px;
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
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.text.secondary};
`

const EmptyIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.text.secondary};
`

const EmptyText = styled.p`
  font-size: ${props => props.theme.typography.body};
  line-height: 1.6;
`

export const Search: React.FC = () => {
  const dispatch = useDispatch()
  
  const { 
    searchResults, 
    loading, 
    error, 
    searchQuery,
    totalPages,
    currentPage
  } = useSelector((state: RootState) => state.books)

  const handleSearch = async (query: string, page: number = 1) => {
    try {
      dispatch(searchBooksStart({ query, page }))
      const response = await searchBooks(query, page)
      dispatch(searchBooksSuccess(response))
    } catch (err) {
      dispatch(searchBooksFailure(err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
    handleSearch(searchQuery, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetry = () => {
    handleSearch(searchQuery, currentPage)
  }
  const {
    handleBookClick,
    handleAddToCart,
    handleAddToBookmarks,
    isBookInBookmarks,
    isBookInCart
  } = useBookstoreHandlers()
  return (
    <SearchContainer>

      {loading && (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Поиск книг...</LoadingText>
        </LoadingContainer>
      )}

      {error && (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>
            Ошибка при поиске: {error}
          </ErrorText>
          <RetryButton onClick={handleRetry}>
            Попробовать снова
          </RetryButton>
        </ErrorContainer>
      )}

      {!loading && !error && searchQuery && searchResults.length > 0 && (
        <ResultsInfo>
          "{searchQuery}" SEARCH RESULTS
        </ResultsInfo>
      )}

      {!loading && !error && searchResults.length > 0 && (
        <>
          <BooksGrid>
            {searchResults.map((book) => (
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showNavigation={true}
            />
          )}
        </>
      )}

      {!loading && !error && searchQuery && searchResults.length === 0 && (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyText>
            По запросу "{searchQuery}" ничего не найдено
          </EmptyText>
        </EmptyState>
      )}

      {!loading && !error && !searchQuery && (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyText>
            Введите название книги, автора или тему в поле поиска выше
          </EmptyText>
        </EmptyState>
      )}
    </SearchContainer>
  )
}