// src/theme.ts
export const lightTheme = {
    colors: {
        primary: "#3490dc",
        secondary: "#ffed4a",
        background: "#ffffff",
        text: "#333333",
    },
};

export const darkTheme = {
    colors: {
        primary: "#2779bd",
        secondary: "#f6993f",
        background: "#1a202c",
        text: "#f7fafc",
    },
};

export type Theme = typeof lightTheme;
