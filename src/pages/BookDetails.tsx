import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { fetchBookDetailsStart } from '../store/books/bookSlice'
import { useBookstoreHandlers } from '../hooks/useHandlers'
import { StarRating } from '../components/Simple/StarsRating'
import { MoreInfo } from '../components/Simple/MoreInfo'

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
  background-color: ${props => props.theme.colors.orange};
  position: relative;
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
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  margin: 20px 0;
`

const DescriptionContainer = styled.div`
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: space-between;
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
  cursor: pointer;
  font-weight: 600;
`
const BookmarkButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  background: ${props => props.theme.colors.primary};
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
const Tabs = styled.div`
  font-family: 'Inter', sans-serif;
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
          <BookmarkButton 
            $active={isBookInBookmarks(currentBook)}
            onClick={() => handleAddToBookmarks(currentBook)}
            title={isBookInBookmarks(currentBook) ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            ♥
          </BookmarkButton>
        </BookCover>
        
        <BookInfo>
          <DescriptionContainer>
            <Price>{currentBook.price}</Price>
            <StarRating 
               rating={parseFloat(currentBook.rating)} 
               size={20}
               showValue={true}
            />
          </DescriptionContainer>          
          <Title>{currentBook.title}</Title>
          <DescriptionContainer>
              <p>Authors</p> 
              <p>{currentBook.authors}</p>
          </DescriptionContainer>
          <DescriptionContainer>
              <p>Publisher</p> 
              <p>{currentBook.publisher}, {currentBook.year} </p>
          </DescriptionContainer>
          <DescriptionContainer>
              <p>Language</p> 
              <p>{currentBook.language || 'English'}</p>
          </DescriptionContainer>
          <DescriptionContainer>
              <p>Format</p> 
              <p>{currentBook.format || 'PDF'}</p>
          </DescriptionContainer>
          <MoreInfo book={currentBook} />
          <Actions>
            {/* Передаем currentBook в обработчики */}
            <Button 
              $primary 
              onClick={() => handleAddToCart(currentBook)}
            >
              {isBookInCart(currentBook) ? 'In Cart' : 'Add to Cart'}
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