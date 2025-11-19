import React from 'react';
import styled from 'styled-components';
import type { ITitle } from '../../types/title';
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

const Title: React.FC<ITitle> = ({text}) => {
    return <TitleContainer>
        <TitleContent>{text}</TitleContent>
    </TitleContainer>;
};
export default Title;