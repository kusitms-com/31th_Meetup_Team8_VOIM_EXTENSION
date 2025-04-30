import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "yellow" | "dark";

interface ThemeContextValue {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme-mode";

export function ThemeProvider({
    children,
    value: { theme, setTheme } = { theme: "light", setTheme: () => {} },
}: {
    children: React.ReactNode;
    value?: ThemeContextValue;
}) {
    const [themeState, setThemeState] = useState<ThemeMode>(theme);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        if (saved) setThemeState(saved);
    }, []);

    const setThemeLocal = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{ theme: themeState, setTheme: setThemeLocal }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeMode must be used within a ThemeProvider");
    }
    return context;
}
