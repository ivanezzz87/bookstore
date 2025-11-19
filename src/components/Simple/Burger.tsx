import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { BurgerMenuProps } from "../../types/burger";

const BurgerMenu: React.FC<BurgerMenuProps> = ({ $isOpen, onClick }) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        $isOpen
      ) {
        onClick();
      }
    };

    // Закрытие меню при нажатии Escape
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && $isOpen) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [$isOpen, onClick]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    onClick(); // Закрываем меню после навигации
  };

  return (
    <div ref={menuRef}>
      <BurgerButton isOpen={$isOpen} onClick={onClick}>
        <BurgerLine isOpen={$isOpen} />
        <BurgerLine isOpen={$isOpen} />
        <BurgerLine isOpen={$isOpen} />
      </BurgerButton>
      <MenuOverlay isOpen={$isOpen}>
        <NavContainer>
          <MenuItem onClick={() => handleMenuItemClick("/")}>
            Home
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/favorites")}>
            Favorites
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/cart")}>
            Cart
          </MenuItem>
          {isAuthenticated ? (
            <MenuItem onClick={() => handleMenuItemClick('/account')}>
              Profile
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleMenuItemClick('/auth')}>
              Login
            </MenuItem>
          )}
        </NavContainer>
      </MenuOverlay>
    </div>
  );
};

const BurgerButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const BurgerLine = styled.div<{ isOpen: boolean }>`
  width: 30px;
  height: 3px;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  transition: all 0.3s ease;
  position: absolute;

  &:nth-child(1) {
    top: ${(props) => (props.isOpen ? "50%" : "25%")};
    transform: ${(props) =>
      props.isOpen ? "translateY(-50%) rotate(45deg)" : "none"};
  }

  &:nth-child(2) {
    top: 50%;
    transform: translateY(-50%);
    opacity: ${(props) => (props.isOpen ? 0 : 1)};
  }

  &:nth-child(3) {
    top: ${(props) => (props.isOpen ? "50%" : "75%")};
    transform: ${(props) =>
      props.isOpen ? "translateY(-50%) rotate(-45deg)" : "none"};
  }
`;

const MenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 84px;
  right: 0;
  width: 236px;
  height: 100%;
  background: ${(props) => props.theme.colors.bwhite};
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 5;
  transition: opacity 0.3s ease;
  border-left: 1px solid ${(props) => props.theme.colors.borderDefault};
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.a`
  color: ${(props) => props.theme.colors.text.primary};
  text-decoration: none;
  padding: 20px 10px;
  transition: all 0.3s ease;
  position: relative;
  border-bottom: 1px solid ${(props) => props.theme.colors.borderDefault};
  cursor: pointer;
  
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.hover};
  }

  &::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 50%;
    width: 10px;
    height: 2px;
    background: ${(props) => props.theme.colors.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export default BurgerMenu;