export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showNavigation?: boolean
  showEdgeNavigation?: boolean
}
