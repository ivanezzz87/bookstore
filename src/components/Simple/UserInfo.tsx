import React from 'react';
import styled from 'styled-components';

interface IUserInfo {
    firstName: string;
    lastName: string;
    children?: React.ReactNode;
}
const StyledUserContainer = styled.div`
padding: 10px 15px;
max-width: 300px;
background-color: #2231AA;
display: flex;
column-gap: 20px;
`
const UserAvatarContainer = styled.div`
background-color: #7277e7ff;
padding: 5px 10px;
border-radius: 5px;
`
const UserAvatar = styled.h2`
color:white;
`
const UserName = styled.h2`
color:white;
`
const UserInfo: React.FC<IUserInfo> = ({ firstName, lastName, children }) => {
    return (
        <StyledUserContainer>
            <UserAvatarContainer>
            <UserAvatar>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
            </UserAvatar>
            </UserAvatarContainer>
            <UserName>
                {firstName} {lastName}
            </UserName>
            {children}
        </StyledUserContainer>
    );
};
export default UserInfo;