import React from 'react';
import styled from 'styled-components';
const TitleContainer = styled.div`
padding: 20px;
border-radius: 3px;
max-width: fit-content;
margin-left: 10%;
`
const TitleContent = styled.h2`
font-size: 32px;
color: var(--text-color);
`
interface ITitle {
    text: string
}
const Title: React.FC<ITitle> = ({text}) => {
    return <TitleContainer>
        <TitleContent>{text}</TitleContent>
    </TitleContainer>;
};
export default Title;