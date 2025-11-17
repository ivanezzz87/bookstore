import React from "react";
import styled from "styled-components";
const currentYear = new Date().getFullYear();
export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <p>© {currentYear} Bookstore</p>
      <p>All rights reserved</p>
    </StyledFooter>
  );
};
const StyledFooter = styled.div`
  margin: 20px auto;
  border-top: 1px solid ${(props) => props.theme.colors.borderDefault};
  display: flex;
  width: 100%;
  align-self: center;
  justify-content: space-between;
  padding: 10px 20px;
  color: ${(props) => props.theme.colors.secondary};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
`;
