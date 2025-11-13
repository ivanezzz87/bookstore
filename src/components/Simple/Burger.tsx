import React from "react";
import styled from "styled-components";
import UserInfo from "./UserInfo";
import { useNavigate} from "react-router-dom";
interface BurgerMenuProps {
  $isOpen: boolean;
  onClick: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ $isOpen, onClick }) => {
  const navigate = useNavigate();
  return (
    <>
      <BurgerButton isOpen={$isOpen} onClick={onClick}>
        <BurgerLine isOpen={$isOpen} />
        <BurgerLine isOpen={$isOpen} />
        <BurgerLine isOpen={$isOpen} />
      </BurgerButton>
      <MenuOverlay isOpen={$isOpen}>
        <NavContainer>
          <UserInfo firstName="Ivan" lastName="Dudko" />
          <MenuItem onClick={() => navigate("/")}>
            Home
          </MenuItem>
          <MenuItem onClick={onClick}>
            Add post
          </MenuItem>
        </NavContainer>
      </MenuOverlay>
    </>
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
  background: ${(props) => (props.isOpen ? "#fff" : "#fff")};
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
  left: 0;
  width: 236px;
  height: 100%;
  background: var(--bg-color);;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: row;
  z-index: 5;
  transition: opacity 0.3s ease;
`;
const NavContainer = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const MenuItem = styled.a`
  color: var(--text-color);
  text-decoration: none;
  padding: 20px 10px;
  transition: all 0.3s ease;
  position: relative;
  border-bottom: 1px solid lightgray;
  &:hover {
    color: #2231aa;
    cursor: pointer;
  }

  &::before {
    content: "";
    position: absolute;
    left: -20px;
    top: 50%;
    width: 10px;
    height: 2px;
    background: #ff6b6b;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;
export default BurgerMenu;
