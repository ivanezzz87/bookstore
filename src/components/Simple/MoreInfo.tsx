import React, { useState } from 'react';
import styled from 'styled-components';
import type { BookDetails } from '../../types/book';

const MoreInfoSection = styled.div`
  margin: 20px 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

const MoreInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bwhite};
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const MoreInfoTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary};
`;

const MoreInfoIcon = styled.span<{ $isOpen: boolean }>`
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
  font-size: 18px;
`;

const MoreInfoContent = styled.div<{ $isOpen: boolean }>`
  padding: ${props => props.$isOpen ? '20px' : '0 20px'};
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: ${(props) => props.theme.colors.bwhite};
`;

const InfoGrid = styled.div`
  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px; */
  display: flex;
  flex-direction: column;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`;

const InfoLabel = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary};
  font-size: 14px;
`;

const InfoValue = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: 14px;
`;

interface MoreInfoProps {
  book: BookDetails;
}

export const MoreInfo: React.FC<MoreInfoProps> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMoreInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MoreInfoSection>
      <MoreInfoHeader onClick={toggleMoreInfo}>
        <MoreInfoTitle>More detailse</MoreInfoTitle>
        <MoreInfoIcon $isOpen={isOpen}>▼</MoreInfoIcon>
      </MoreInfoHeader>
      <MoreInfoContent $isOpen={isOpen}>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Subtitle:</InfoLabel>
            <InfoValue>{book.subtitle|| 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Pages:</InfoLabel>
            <InfoValue>{book.pages || 'N/A'}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </MoreInfoContent>
    </MoreInfoSection>
  );
};
export default MoreInfo; 