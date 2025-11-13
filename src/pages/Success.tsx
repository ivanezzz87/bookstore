import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Title from "../components/Title";
import { useNavigate} from "react-router-dom";
export const Success: React.FC = () => {
   const navigate = useNavigate();
  return (
    <div>
      <BackToHome href="/">Back to home</BackToHome>
      <Title text="Success" />
      <Container>
       <ConfirmText>Email confirmed 
        Your registration is now completed
       </ConfirmText>
        <Button
          content="Go to home"
          type="primary"
          state="enabled"
          onClick={() => navigate("/")}
        />
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
`;
const BackToHome = styled.a`
  text-decoration: none;
  color: #000;
  font-size: 16px;
`;
const ConfirmText = styled.p`
  font-size: 16px;
  color: #000;
  text-align: center;
`;
export default Success;