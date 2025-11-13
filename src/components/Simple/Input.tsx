import React, { useState } from "react";
import styled from "styled-components";

interface IInput {
  type: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  disabled?: boolean;
  label?: string;
  id?: string;
  isError?: boolean; 
  textError?: string; 
  onChange: (value: string) => void;
}

const Input: React.FC<IInput> = ({
  type,
  placeholder,
  value,
  disabled = false,
  label,
  id,
  isError: propIsError,
  textError: propTextError,
  onChange,
}) => {
  const [localIsError, setLocalIsError] = useState(false);
  const [localTextError, setLocalTextError] = useState("");

  const validate = (val: string) => {
    if (disabled || val.trim() === "") {
      return { isError: false, textError: "" };
    }

    switch (type) {
      case "text":
        if (val.length < 1) {
          return { isError: true, textError: "Поле не может быть пустым" };
        }
        return { isError: false, textError: "" };

      case "email":
        { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          return { isError: true, textError: "Неверный формат email" };
        }
        return { isError: false, textError: "" }; }

      case "password":
        if (val.length < 8) {
          return { isError: true, textError: "Пароль должен быть минимум 8 символов" };
        }
        if (!/[A-Z]/.test(val)) {
          return { isError: true, textError: "Пароль должен содержать заглавную букву" };
        }
        if (!/[a-z]/.test(val)) {
          return { isError: true, textError: "Пароль должен содержать строчную букву" };
        }
        if (!/[0-9]/.test(val)) {
          return { isError: true, textError: "Пароль должен содержать цифру" };
        }
        if (!/[!@#$%^&*]/.test(val)) {
          return { isError: true, textError: "Пароль должен содержать специальный символ (!@#$ etc.)" };
        }
        return { isError: false, textError: "" };

      default:
        return { isError: false, textError: "" };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    validate(newValue);
  };

  const handleBlur = () => {
    const { isError, textError } = validate(value);
    setLocalIsError(isError);
    setLocalTextError(textError);
  };


  const finalIsError = propIsError !== undefined ? propIsError : localIsError;
  const finalTextError = propTextError !== undefined ? propTextError : localTextError;

  return (
    <InputContainer>
      {label && (
        <StyledLabel htmlFor={id} $disabled={disabled}>
          {label}
        </StyledLabel>
      )}
      <StyledInput
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        $isError={finalIsError}
      />
      {finalIsError && finalTextError && <Error>{finalTextError}</Error>}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
  padding: 10px;
`;

const StyledLabel = styled.label<{ $disabled?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: var(--text-color);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
`;

const Error = styled.span`
  font-size: 12px;
  color: red;
  text-align: left;
  margin-top: -2px;
`;

const StyledInput = styled.input<{ $isError: boolean }>`
  width: 450px;
  padding: 12px 16px;
  border: ${(props) => (props.$isError ? "1px solid red" : "none")};
  border-radius: 1px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  outline: none;
  cursor: pointer;

  &:focus {
    border: 2px solid ${(props) => (props.$isError ? "red" : "#dadada")};
  }
  &:active {
    background-color: #dadada;
    border: none;
  }
  &:disabled {
    background-color: #dadada;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #dadada;
  }
`;

export default Input;