import { createGlobalStyle } from 'styled-components'


export const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Bebas Neue', sans-serif;
    background-color: ${props => props.theme.colors.bwhite};
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.6;
  }

  #root {
    min-height: 100vh;
  }
`