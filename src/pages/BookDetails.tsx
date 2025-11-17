import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { fetchBookDetailsStart } from '../store/books/bookSlice'
import { useBookstoreHandlers } from '../hooks/useHandlers'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #2D3748;
  cursor: pointer;
  padding: 10px 0;
  margin-bottom: 20px;
  font-size: 16px;

  &:hover {
    color: #4A5568;
  }
`

const Content = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const BookCover = styled.div`
  flex-shrink: 0;
  width: 250px;
`

const BookImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
`

const BookInfo = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
`

const Price = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 20px 0;
`

const Actions = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`

const Button = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  border: ${props => props.$primary ? 'none' : '1px solid #2D3748'};
  background: ${props => props.$primary ? '#2D3748' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#2D3748'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
`

const Tabs = styled.div`
  margin-top: 30px;
`

const TabHeaders = styled.div`
  display: flex;
  border-bottom: 1px solid #E2E8F0;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 15px 20px;
  background: none;
  border: none;
  border-bottom: ${props => props.$active ? '2px solid #2D3748' : 'none'};
  color: ${props => props.$active ? '#2D3748' : '#718096'};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
`

const TabContent = styled.div`
  padding: 20px 0;
  line-height: 1.6;
  color: #4A5568;
`

const Loading = styled.div`
  text-align: center;
  padding: 60px 20px;
`

const Error = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #E53E3E;
`

type TabType = 'description' | 'authors' | 'reviews'

export const BookDetails: React.FC = () => {
  const { isbn13 } = useParams<{ isbn13: string }>()
  const dispatch = useDispatch()
  const { currentBook, loading, error } = useSelector((state: RootState) => state.books)
  
  const [activeTab, setActiveTab] = useState<TabType>('description')
  
  // Используем хук обработчиков
  const {
    handleAddToCart,
    handleAddToBookmarks,
    handleBack,
    isBookInBookmarks,
    isBookInCart
  } = useBookstoreHandlers()

  useEffect(() => {
    if (isbn13) {
      dispatch(fetchBookDetailsStart(isbn13))
    }
  }, [dispatch, isbn13])

  if (loading) return <Loading>Loading...</Loading>
  if (error) return <Error>Error: {error}</Error>
  if (!currentBook) return <Error>Book not found</Error>

  return (
    <Container>
      <BackButton onClick={handleBack}>←</BackButton>
      
      <Content>
        <BookCover>
          <BookImage src={currentBook.image} alt={currentBook.title} />
        </BookCover>
        
        <BookInfo>          
          <Price>{currentBook.price}</Price>
          <Title>{currentBook.title}</Title>
          {currentBook.subtitle && <p>{currentBook.subtitle}</p>}
          
          <div>
            <p><strong>Authors:</strong> {currentBook.authors}</p>
            <p><strong>Publisher:</strong> {currentBook.publisher}</p>
            <p><strong>Year:</strong> {currentBook.year}</p>
            <p><strong>Pages:</strong> {currentBook.pages}</p>
            <p><strong>Rating:</strong> ⭐ {currentBook.rating}/5</p>
          </div>

          <Actions>
            {/* Передаем currentBook в обработчики */}
            <Button 
              $primary 
              onClick={() => handleAddToCart(currentBook)}
            >
              {isBookInCart(currentBook) ? 'In Cart' : 'Add to Cart'}
            </Button>
            <Button 
              onClick={() => handleAddToBookmarks(currentBook)}
            >
              {isBookInBookmarks(currentBook) ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </Actions>
        </BookInfo>
      </Content>

      {/* Табы */}
      <Tabs>
        <TabHeaders>
          <Tab 
            $active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </Tab>
          <Tab 
            $active={activeTab === 'authors'}
            onClick={() => setActiveTab('authors')}
          >
            Authors
          </Tab>
          <Tab 
            $active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </Tab>
        </TabHeaders>
        
        <TabContent>
          {activeTab === 'description' && (
            <p>{currentBook.desc}</p>
          )}
          
          {activeTab === 'authors' && (
            <p>{currentBook.authors}</p>
          )}
          
          {activeTab === 'reviews' && (
            <p>No reviews yet.</p>
          )}
        </TabContent>
      </Tabs>
    </Container>
  )
}