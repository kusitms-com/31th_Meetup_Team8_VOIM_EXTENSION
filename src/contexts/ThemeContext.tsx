import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
export type FontSize = "xl" | "l" | "m" | "s" | "xs";

interface AppThemeContextValue {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontClasses: {
        fontHeading: string;
        fontCommon: string;
        fontCaption: string;
    };
}

const AppThemeContext = createContext<AppThemeContextValue | undefined>(
    undefined,
);

const THEME_KEY = "theme-mode";
const FONT_KEY = "font-size";

const fontSizeClassMap: Record<FontSize, AppThemeContextValue["fontClasses"]> =
    {
        xl: {
            fontHeading: "text-[32px]",
            fontCommon: "text-[28px]",
            fontCaption: "text-[24px]",
        },
        l: {
            fontHeading: "text-[30px]",
            fontCommon: "text-[26px]",
            fontCaption: "text-[22px]",
        },
        m: {
            fontHeading: "text-[28px]",
            fontCommon: "text-[24px]",
            fontCaption: "text-[20px]",
        },
        s: {
            fontHeading: "text-[26px]",
            fontCommon: "text-[22px]",
            fontCaption: "text-[18px]",
        },
        xs: {
            fontHeading: "text-[24px]",
            fontCommon: "text-[20px]",
            fontCaption: "text-[16px]",
        },
    };

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("light");
    const [fontSize, setFontSizeState] = useState<FontSize>("m");

    // 초기 로드
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
        if (savedTheme && ["light", "dark"].includes(savedTheme)) {
            setThemeState(savedTheme);
        }

        const savedFontSize = localStorage.getItem(FONT_KEY) as FontSize | null;
        if (
            savedFontSize &&
            ["xl", "l", "m", "s", "xs"].includes(savedFontSize)
        ) {
            setFontSizeState(savedFontSize);
        }
    }, []);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    };

    const setFontSize = (newSize: FontSize) => {
        setFontSizeState(newSize);
        localStorage.setItem(FONT_KEY, newSize);
    };

    const fontClasses = fontSizeClassMap[fontSize];

    return (
        <AppThemeContext.Provider
            value={{ theme, setTheme, fontSize, setFontSize, fontClasses }}
        >
            {children}
        </AppThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context = useContext(AppThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within an AppThemeProvider");
    }
    return context;
}
