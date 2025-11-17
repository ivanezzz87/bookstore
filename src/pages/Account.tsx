import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { logout, clearError} from '../store/user/userSlice'
import type { RootState } from '../store/index'
import Title from '../components/Simple/Title'
const AccountContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.bwhite};
  padding: ${props => props.theme.spacing.xl};
`

const AccountCard = styled.div`
  background: ${props => props.theme.colors.bwhite};
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
`

const Content = styled.div`
  padding: 40px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`

const Input = styled.input<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$error ? props.theme.colors.error : props.theme.colors.borderDefault};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.bwhite};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  
  &:disabled {
    background: #F7FAFC;
    color: #A0AEC0;
    cursor: not-allowed;
  }
`

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  margin-top: 2px;
`

const GlobalError = styled.div`
  background: #FED7D7;
  border: 1px solid #FEB2B2;
  color: ${props => props.theme.colors.error};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`

const LogoutButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.bwhite};
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  
  &:hover {
    background: ${props => props.theme.colors.primary2};
  }
`

export const Account: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, error } = useSelector((state: RootState) => state.user)
  
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  })
  const [formErrors, setFormErrors] = useState({
    username: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      })
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    if (error) {
      dispatch(clearError())
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }
  if (!user) {
    return null
  }

  return (
    <AccountContainer>
      <AccountCard>
          <Title text='Account'></Title>
        <Content>
          {error && (
            <GlobalError>
              {error}
            </GlobalError>
          )}

          <Form >
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                $error={!!formErrors.username}
              />
              {formErrors.username && <ErrorText>{formErrors.username}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                placeholder="Your email address"
              />
              <small style={{ color: '#718096', fontSize: '12px' }}>
                Email cannot be changed
              </small>
            </FormGroup>

            <ButtonGroup>
              <LogoutButton type="button" onClick={handleLogout}>
                Logout
              </LogoutButton>
            </ButtonGroup>
          </Form>
        </Content>
      </AccountCard>
    </AccountContainer>
  )
}

export default Account