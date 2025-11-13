import { useState, useMemo } from 'react';

export const usePagination = (totalItems: number, itemsPerPage: number = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage),
  [totalItems, itemsPerPage]
  );

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage
  };
};