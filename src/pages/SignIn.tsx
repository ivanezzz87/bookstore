import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/Simple/Input";
import Button from "../components/Simple/Button";
import Title from "../components/Simple/Title";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/user/authSlice";
import type { AppDispatch, RootState } from "../store";

export const SignIn: React.FC = () => {
  const [formData, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Очищаем ошибки при монтировании компонента
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на posts
    if (accessToken) {
      navigate("/posts");
    }
  }, [accessToken, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    const resultAction = await dispatch(login({
      email: formData.email,
      password: formData.password,
    }));

    if (login.fulfilled.match(resultAction)) {
      navigate("/posts");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div>
      <HeaderContainer>
        <BackToHome as={Link} to="/">Back to home</BackToHome>
        <Title text="Sign in" />
      </HeaderContainer>
      <Container onKeyPress={handleKeyPress}>
        <Input
          type="email"
          value={formData.email}
          placeholder="Enter your email"
          label="Email"
          id="email"
          onChange={(value) => handleInputChange("email", value)}
        />
        <Input
          type="password"
          value={formData.password}
          placeholder="Enter your password"
          label="Password"
          id="password"
          onChange={(value) => handleInputChange("password", value)}
        />
        <ForgotPasswordLink href="#">Forgot password?</ForgotPasswordLink>
        
        {error && (
          <ErrorMessage>
            {typeof error === 'string' 
              ? error 
              : 'Login failed. Please check your credentials.'}
          </ErrorMessage>
        )}
        
        <Button
          content={isLoading ? "Signing in..." : "Sign in"}
          type="primary"
          state={isLoading ? "disabled" : "enabled"}
          onClick={handleSubmit}
        />
        <SignUpText>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignUpText>
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
  height: 500px;
  width: 500px;
  border: 1px solid lightgray;
  padding: 40px;
`;

const BackToHome = styled(Link)`
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

const ForgotPasswordLink = styled.a`
  text-decoration: none;
  color: var(--link-color);
  font-size: 14px;
  align-self: flex-start;
  margin-left: 10px;
  
  &:hover {
    color: var(--link-hover-color);
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  text-align: center;
  width: 100%;
  margin: 10px 0;
`;

const SignUpText = styled.span`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
`;

export default SignIn;