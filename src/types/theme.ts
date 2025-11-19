export const theme = {
  colors: {
    primary: "#313037",
    primary2: "#5B5A62",
    secondary: "#B3B3B3",
    bwhite: "#fff",
    bgrey: "#E7E7E7",
    blight: "#F7F7F7",
    surface: "#D7E4FD",
    orange: "#FEE9E2",
    text: {
      primary: "#313037",
      primary2: "#5B5A62",
      secondary: "#B3B3B3",
      accent: "#A8A8A8",
    },
    borderDefault: "#E7E7E7",
    hover: "#5B5A62",
    error: "#FC857F",
    success: "#4CAF50",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  shadows: {
    sm: "0 2px 4px rgba(0,0,0,0.3)",
    md: "0 4px 12px rgba(0,0,0,0.3)",
    lg: "0 8px 24px rgba(0,0,0,0.3)",
  },
  typography: {
    h1: "32px",
    h2: "24px",
    h3: "18px",
    body: "16px",
    small: "14px",
  },
} as const;

export type Theme = typeof theme;
