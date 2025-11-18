import React from 'react'
import styled from 'styled-components'
import type { StarRatingProps } from '../../types/stars'

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StarsWrapper = styled.div`
  display: flex;
  gap: 2px;
`

const Star = styled.span<{ $filled: boolean; $size?: number }>`
  color: ${props => props.$filled ? props.theme.colors.primary : props.theme.colors.secondary};
  font-size: ${props => props.$size || 18}px;
  transition: color 0.2s ease;
`

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 18,
  className
}) => {
  const normalizedRating = Math.min(Math.max(rating, 0), maxStars);
  
  return (
    <RatingContainer className={className}>
      <StarsWrapper>
        {[...Array(maxStars)].map((_, index) => (
          <Star 
            key={index}
            $filled={index < Math.floor(normalizedRating)}
            $size={size}
          >
            ★
          </Star>
        ))}
      </StarsWrapper>
    </RatingContainer>
  );
};