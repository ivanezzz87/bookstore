import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import Title from "../components/Title";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../AuthSlice";
import type { AppDispatch, RootState } from "../store/store";

export const Signup: React.FC = () => {
  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Очищаем ошибки при монтировании компонента
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      alert("Заполните все обязательные поля");
      return;
    }

    const resultAction = await dispatch(register({
      username: formData.name,
      email: formData.email,
      password: formData.password,
      re_password: formData.confirmPassword,
      course_group: 18,
    }));

    if (register.fulfilled.match(resultAction)) {
      navigate("/success");
    }
  };

  return (
    <div>
      <HeaderContainer>
        <BackToHome href="/">Back to home</BackToHome>
        <Title text="Sign up" />
      </HeaderContainer>
      <Container>
        <Input
          type="text"
          value={formData.name}
          placeholder="Your name"
          label="Name"
          id="name"
          onChange={(value) => handleInputChange("name", value)}
        />
        <Input
          type="email"
          value={formData.email}
          placeholder="Your email"
          label="Email"
          id="email"
          onChange={(value) => handleInputChange("email", value)}
        />
        <Input
          type="password"
          value={formData.password}
          placeholder="Your password"
          label="Password"
          id="password"
          onChange={(value) => handleInputChange("password", value)}
        />
        <Input
          type="password"
          value={formData.confirmPassword}
          placeholder="Confirm password"
          label="Confirm Password"
          id="confirmPassword"
          onChange={(value) => handleInputChange("confirmPassword", value)}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button
          content={isLoading ? "Loading..." : "Sign up"}
          type="primary"
          state={isLoading ? "disabled" : "enabled"}
          onClick={handleSubmit}
        />
        <span>
          Already have account? <StyledLink to="/">Sign in</StyledLink>
        </span>
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
  margin: 0 auto;
  height: fit-content;
  width: 500px;
  border: 1px solid lightgray;
  padding: 20px;
`;

const BackToHome = styled.a`
  text-decoration: none;
  color: var(--link-color);
  font-size: 16px;
  margin-left: 10%;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--link-color);
  cursor: pointer;

  &:hover {
    color: var(--link-hover-color);
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: center;
`;

export default Signup;