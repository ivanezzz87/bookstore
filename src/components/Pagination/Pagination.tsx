import React from 'react'
import styled from 'styled-components'
import type { PaginationProps } from '../../types/pagination';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.sm};
`

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  background-color: ${props => props.theme.colors.bwhite};
  border: none;
  color: ${props => {
    if (props.$active) return props.theme.colors.secondary;
    if (props.$disabled) return props.theme.colors.text.primary;
    return props.theme.colors.text.primary;
  }};
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
    color: ${props => props.$active ? props.theme.colors.secondary : props.theme.colors.primary};
    transform: ${props => props.$active ? 'none' : 'translateY(-2px)'};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const NavigationButton = styled(PageButton)<{ $disabled?: boolean }>`
  background-color: ${props => props.theme.colors.bwhite};
  border: none;
  color: ${props => props.$disabled ? props.theme.colors.text.secondary : props.theme.colors.text.primary};
  
  &:hover:not(:disabled) {
    color: ${props => props.theme.colors.primary};
  }
`

const Dots = styled.span`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 600;
`

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showNavigation = true
}) => {
  if (totalPages <= 1) return null

  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const delta = 2

    // Всегда показываем первую страницу
    pages.push(1)

    if (currentPage - delta > 2) {
      pages.push('...')
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i)
    }

    // Показываем точки, если необходимо
    if (currentPage + delta < totalPages - 1) {
      pages.push('...')
    }

    // Всегда показываем последнюю страницу
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

  const isPreviousDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  return (
    <PaginationContainer>
      {showNavigation && (
        <NavigationButton
          onClick={handlePrevious}
          $disabled={isPreviousDisabled}
          disabled={isPreviousDisabled}
        >
          ← Prev
        </NavigationButton>
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
        <NavigationButton
          onClick={handleNext}
          $disabled={isNextDisabled}
          disabled={isNextDisabled}
        >
          Next →
        </NavigationButton>
      )}
    </PaginationContainer>
  )
}