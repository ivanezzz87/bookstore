import React from 'react';
import styled from 'styled-components';
interface IButton {
    content: string;
    type: 'primary' | 'secondary' | 'secondary2';
    state: 'enabled' | 'disabled';
    onClick: () => void
}
    ;
const Button: React.FC<IButton> = ({ content, type, state, onClick }) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (state !== 'disabled') {
            onClick();
        }
    };
    return (
        <StyledButton
            buttontype={type}
            buttonstate={state}
            onClick={handleClick}
            disabled={state === 'disabled'}
        >
            {content}
        </StyledButton>
    );
};
const StyledButton = styled.button<{
    buttontype: 'primary' | 'secondary' | 'secondary2';
    buttonstate: 'enabled' | 'disabled'
}>`
    padding: 12px 24px;
    border: none;
    border-radius: 3px;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 300px;
    cursor: ${props => props.buttonstate === 'disabled' ? 'not-allowed' : 'pointer'};
        ${props => {
        if (props.buttontype === 'primary') {
            return `
                    background-color: #535bf2;
                    color: #fff;
                    &:hover {
                        opacity: 0.5;
                    }
                    &:active {
                        background-color: #f9f9f9;
                        color: grey;
                        } 
            `;
        }
        if (props.buttontype === 'secondary') {
            return `
                    background-color: lightgrey;
                    color: #000;
                    &:hover {
                       background-color: grey;
                    }
                    &:active {
                        background-color: #f9f9f9;
                        color: grey;
                        } 
            `;
        }
        if (props.buttontype === 'secondary2') {
            return `
                    background-color: #fff;
                    color: red;
                    &:hover {
                        border: 1px solid grey;
                    }
                    &:active {
                        color: grey;
                        border: none;
                        background-color: #fff;
                        } 
            `;
        }
        return '';
    }}
 `
export default Button;