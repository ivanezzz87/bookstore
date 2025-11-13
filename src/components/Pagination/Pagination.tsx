import React from 'react'
import styled from 'styled-components'

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.sm};
`

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.borderDefault};
  color: ${props => props.$active ? 'white' : props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.small};
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.3s ease;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? props.theme.colors.secondary : props.theme.colors.bwhite};
    border-color: ${props => props.$active ? props.theme.colors.secondary : props.theme.colors.primary};
    transform: ${props => props.$active ? 'none' : 'translateY(-2px)'};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const PageInfo = styled.span`
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 ${props => props.theme.spacing.md};
`

const Dots = styled.span`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 600;
`

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageInfo?: boolean
  showNavigation?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  showNavigation = true
}) => {
  if (totalPages <= 1) return null

  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const delta = 1

    // Always show first page
    pages.push(1)

    // Show dots if needed before middle pages
    if (currentPage - delta > 2) {
      pages.push('...')
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i)
    }

    // Show dots if needed after middle pages
    if (currentPage + delta < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <PaginationContainer>
      {showNavigation && (
        <PageButton
          onClick={handlePrevious}
          $disabled={currentPage === 1}
          disabled={currentPage === 1}
        >
          ← Prev
        </PageButton>
      )}
      
      {getVisiblePages().map((page, index) =>
        page === '...' ? (
          <Dots key={`dots-${index}`}>...</Dots>
        ) : (
          <PageButton
            key={page}
            $active={currentPage === page}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </PageButton>
        )
      )}
      
      {showNavigation && (
        <PageButton
          onClick={handleNext}
          $disabled={currentPage === totalPages}
          disabled={currentPage === totalPages}
        >
          Next →
        </PageButton>
      )}
      
      {showPageInfo && (
        <PageInfo>
          Page {currentPage} of {totalPages}
        </PageInfo>
      )}
    </PaginationContainer>
  )
}