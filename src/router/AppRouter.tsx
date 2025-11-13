import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { BookDetails } from '../pages/BookDetails'
import { Search } from '../pages/Search'
// import { Bookmarks } from '../pages/Bookmarks/Bookmarks'
import { Cart } from '../pages/Cart'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:isbn13" element={<BookDetails />} />
      <Route path="/search" element={<Search />} />
      {/* <Route path="/bookmarks" element={<Bookmarks />} /> */}
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}