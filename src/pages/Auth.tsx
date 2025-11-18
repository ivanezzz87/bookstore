import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  loginStart,
  signupStart,
  clearError
} from '../store/user/userSlice'
import type { RootState } from '../store/index'

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.bwhite};
  padding: ${props => props.theme.spacing.xl};
`

const AuthCard = styled.div`
  background: ${props => props.theme.colors.bwhite};
  width: 100%;
  max-width: 440px;
  overflow: hidden;
`

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.borderDefault};
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 20px;
  background: none;
  border: none;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.colors.primary};
    transform: scaleX(${props => props.$active ? 1 : 0});
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary2};
  }
`

const TabContent = styled.div`
  padding: 40px;
`
const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`

const Input = styled.input<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$error ? props.theme.colors.error: props.theme.colors.borderDefault};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.bwhite};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.borderDefault};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.secondary};
  }
`

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  margin-top: 2px;
`

const SubmitButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.bwhite};
  border: none;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary2};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${props => props.theme.colors.bgrey};
    cursor: not-allowed;
    transform: none;
  }
`

const GlobalError = styled.div`
  background: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.error};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`
type TabType = 'login' | 'register'

export const Auth: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user)
  
  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Редирект при успешной аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // Очистка ошибок при смене таба
  useEffect(() => {
    dispatch(clearError())
    setFormErrors({ username: '', email: '', password: '', confirmPassword: '' })
  }, [activeTab, dispatch])

  const validateLoginForm = () => {
    const errors = { email: '', password: '' }
    let isValid = true

    if (!loginData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }

    if (!loginData.password) {
      errors.password = 'Password is required'
      isValid = false
    }

    setFormErrors(prev => ({ ...prev, ...errors }))
    return isValid
  }

  const validateRegisterForm = () => {
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
    let isValid = true

    if (!registerData.username.trim()) {
      errors.username = 'Username is required'
      isValid = false
    } else if (registerData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
      isValid = false
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }

    if (!registerData.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateLoginForm()) {
      dispatch(loginStart(loginData))
    }
  }

const handleRegister = (e: React.FormEvent) => {
  e.preventDefault()
  if (validateRegisterForm()) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...signupData } = registerData
    // Убедитесь, что передаем правильные данные
    dispatch(signupStart({
      username: signupData.username,
      email: signupData.email,
      password: signupData.password
    }))
  }
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'login' | 'register') => {
    const { name, value } = e.target
    
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }))
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }))
    }
    
    // Очищаем ошибку при вводе
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Очищаем глобальную ошибку
    if (error) {
      dispatch(clearError())
    }
  }

  return (
    <AuthContainer>
      <AuthCard>
        <TabsContainer>
          <Tab 
            $active={activeTab === 'login'}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </Tab>
          <Tab 
            $active={activeTab === 'register'}
            onClick={() => setActiveTab('register')}
          >
            Sign Up
          </Tab>
        </TabsContainer>

        <TabContent>

          {error && (
            <GlobalError>
              {error}
            </GlobalError>
          )}

          {activeTab === 'login' ? (
            <>
              <AuthForm onSubmit={handleLogin}>
                <FormGroup>
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={(e) => handleInputChange(e, 'login')}
                    placeholder="Enter your email"
                    $error={!!formErrors.email}
                  />
                  {formErrors.email && <ErrorText>{formErrors.email}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange(e, 'login')}
                    placeholder="Enter your password"
                    $error={!!formErrors.password}
                  />
                  {formErrors.password && <ErrorText>{formErrors.password}</ErrorText>}
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </SubmitButton>
              </AuthForm>
            </>
          ) : (
            <>
              <AuthForm onSubmit={handleRegister}>
                <FormGroup>
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    type="text"
                    id="register-username"
                    name="username"
                    value={registerData.username}
                    onChange={(e) => handleInputChange(e, 'register')}
                    placeholder="Enter your username"
                    $error={!!formErrors.username}
                  />
                  {formErrors.username && <ErrorText>{formErrors.username}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="register-email">Email Address</Label>
                  <Input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={(e) => handleInputChange(e, 'register')}
                    placeholder="Enter your email"
                    $error={!!formErrors.email}
                  />
                  {formErrors.email && <ErrorText>{formErrors.email}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    type="password"
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={(e) => handleInputChange(e, 'register')}
                    placeholder="Create a password"
                    $error={!!formErrors.password}
                  />
                  {formErrors.password && <ErrorText>{formErrors.password}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <Input
                    type="password"
                    id="register-confirm-password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleInputChange(e, 'register')}
                    placeholder="Confirm your password"
                    $error={!!formErrors.confirmPassword}
                  />
                  {formErrors.confirmPassword && <ErrorText>{formErrors.confirmPassword}</ErrorText>}
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </SubmitButton>
              </AuthForm>
            </>
          )}
        </TabContent>
      </AuthCard>
    </AuthContainer>
  )
}

export default Auth