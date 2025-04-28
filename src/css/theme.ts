// Design tokens for Emotion
const tokens = {
    // Colors
    colors: {
        // Grayscale
        grayscale: {
            100: "#FEFEFE",
            200: "#F5F7FB",
            300: "#EAEDF4",
            400: "#CFD2D8",
            500: "#8A8D93",
            600: "#6C6E73",
            700: "#505156",
            800: "#323335",
            900: "#121212",
        },
        // Purple
        purple: {
            light: "#B872FF",
            default: "#8914FF",
            dark: "#5A0EA7",
        },
        // Yellow
        yellow: {
            light: "#FDDB66",
            default: "#FDC300",
        },
        // Blue
        blue: {
            light: "#454CEE",
            default: "#373DCC",
        },
    },
};

// Export the complete design system
export const theme = {
    colors: tokens.colors,
};

// Usage examples:

/*
  // Example 1: Using the theme in Emotion
  import { css } from '@emotion/react';
  
  const headerStyle = css`
    color: ${theme.colors.purple.default};
    ${theme.typography.styles.font24Bold}
    font-family: ${theme.fonts.koddi};
  `;
  
  // Example 2: Creating a styled component
  import styled from '@emotion/styled';
  
  const Header = styled.h1`
    color: ${props => props.theme.colors.purple.default};
    ${props => props.theme.typography.styles.font24Bold}
    font-family: ${props => props.theme.fonts.koddi};
  `;
  
  // Example 3: Using with ThemeProvider
  import { ThemeProvider } from '@emotion/react';
  
  const App = () => (
    <ThemeProvider theme={theme}>
      <Header>Hello World</Header>
    </ThemeProvider>
  );
  */

export default theme;
