import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import type { RootState } from '../../store'
import { searchBooksStart } from '../../store/books/bookSlice'
import SearchIcon from '../../assets/Search.svg';
import BookmarkIcon from '../../assets/Favourites.svg';
import CartIcon from '../../assets/Cart.svg';
import UserIcon from '../../assets/User.svg';
import BurgerMenu from '../Simple/Burger';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.bwhite};
  border-bottom: 1px solid ${props => props.theme.colors.borderDefault};
  padding: 0 ${props => props.theme.spacing.xl};
  position: sticky;
  top: 0;
  z-index: 1000;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.bwhite};
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.borderDefault};
  flex: 0 1 400px;

  @media (max-width: 768px) {
    flex: 1;
    margin: 0 10px;
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.small};
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`

const SearchButton = styled.button`
  background: ${props => props.theme.colors.bwhite};
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.hover};
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    display: none;
  }
`

const NavButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  color: ${props => 
    props.$active 
      ? props.theme.colors.primary 
      : props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${props => props.theme.typography.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.hover};
  }
`

const MobileNav = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { items: cartItems } = useSelector((state: RootState) => state.cart)
  const { bookmarks } = useSelector((state: RootState) => state.user)
  const { isAuthenticated } = useSelector((state: RootState) => state.user)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(searchBooksStart({ query: searchQuery.trim() }))
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleBurgerToggle = () => {
    setIsBurgerOpen(!isBurgerOpen)
  }

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const bookmarksCount = bookmarks.length

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => navigate('/')}>
          BookStore
        </Logo>

        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            <img src={SearchIcon} alt="Search" />
          </SearchButton>
        </SearchForm>

        {/* Десктопная навигация */}
        <Nav>
          <NavButton 
            $active={location.pathname === '/favorites'}
            onClick={() => navigate('/favorites')}
          >
            <img src={BookmarkIcon} alt="Favorites" /> 
          {bookmarksCount > 0 && `(${bookmarksCount})`}
          </NavButton>
          
          <NavButton 
            $active={location.pathname === '/cart'}
            onClick={() => navigate('/cart')}
          >
            <img src={CartIcon} alt="Cart" /> 
          {cartItemsCount > 0 && `(${cartItemsCount})`}
          </NavButton>

          {isAuthenticated ? (
            <NavButton $active={false}
              onClick={() => navigate('/account')}
            >
              <img src={UserIcon} alt="Profile" />
            </NavButton>
          ) : (
            <NavButton $active={false}
              onClick={() => navigate('/auth')}
            >
              Login
            </NavButton>
          )}
        </Nav>

        {/* Мобильная навигация - используем компонент BurgerMenu */}
        <MobileNav>
          <BurgerMenu 
            $isOpen={isBurgerOpen} 
            onClick={handleBurgerToggle}
          />
        </MobileNav>
      </HeaderContent>
    </HeaderContainer>
  )
}