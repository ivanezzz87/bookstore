import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { BookDetails } from "../pages/BookDetails";
import { Search } from "../pages/Search";
import { Favorites } from "../pages/Favorites";
import { Cart } from "../pages/Cart";
import { Auth } from "../pages/Auth";
import  NotFound from "../pages/NotFound";
import { Account } from "../pages/Account";
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:isbn13" element={<BookDetails />} />
      <Route path="/search" element={<Search />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
