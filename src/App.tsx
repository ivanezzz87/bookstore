import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { theme } from './types/theme'
import { GlobalStyles } from './styles/global'
import { AppRouter } from './router/AppRouter'
import { Header } from './components/Header/Header'

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  background: ${props => props.theme.colors.background};
`

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <AppContainer>
            <Header />
            <Main>
              <AppRouter />
            </Main>
          </AppContainer>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App