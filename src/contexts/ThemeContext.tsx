import { logger } from "@src/utils/logger";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
export type FontSize = "xl" | "l" | "m" | "s" | "xs";
export type FontWeight = "xbold" | "bold" | "regular";

interface AppThemeContextValue {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontWeight: FontWeight;
    setFontWeight: (weight: FontWeight) => void;
    fontClasses: {
        fontHeading: string;
        fontCommon: string;
        fontCaption: string;
    };
}

export const AppThemeContext = createContext<AppThemeContextValue | undefined>(
    undefined,
);

const THEME_KEY = "theme-mode";
const FONT_SIZE_KEY = "font-size";
const FONT_WEIGHT_KEY = "font-weight";

const fontSizeClassMap: Record<
    FontSize,
    { heading: string; common: string; caption: string }
> = {
    xl: {
        heading: "text-[32px]",
        common: "text-[28px]",
        caption: "text-[24px]",
    },
    l: {
        heading: "text-[30px]",
        common: "text-[26px]",
        caption: "text-[22px]",
    },
    m: {
        heading: "text-[28px]",
        common: "text-[24px]",
        caption: "text-[20px]",
    },
    s: {
        heading: "text-[26px]",
        common: "text-[22px]",
        caption: "text-[18px]",
    },
    xs: {
        heading: "text-[24px]",
        common: "text-[20px]",
        caption: "text-[16px]",
    },
};

const fontWeightClassMap: Record<FontWeight, string> = {
    xbold: "font-extrabold",
    bold: "font-bold",
    regular: "font-normal",
};

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    // TODO: 배포할때 기본값 변경
    const [theme, setThemeState] = useState<ThemeMode>("dark");
    const [fontSize, setFontSizeState] = useState<FontSize>("xs");
    const [fontWeight, setFontWeightState] = useState<FontWeight>("xbold");

    useEffect(() => {
        if (!chrome?.storage?.local) return;
        const loadSettings = async () => {
            const result = await chrome.storage.local.get([
                THEME_KEY,
                FONT_SIZE_KEY,
                FONT_WEIGHT_KEY,
            ]);

            if (["light", "dark"].includes(result[THEME_KEY])) {
                setThemeState(result[THEME_KEY]);
            }
            if (["xl", "l", "m", "s", "xs"].includes(result[FONT_SIZE_KEY])) {
                setFontSizeState(result[FONT_SIZE_KEY]);
            }
            if (
                ["xbold", "bold", "regular"].includes(result[FONT_WEIGHT_KEY])
            ) {
                setFontWeightState(result[FONT_WEIGHT_KEY]);
            }
        };

        loadSettings();
    }, []);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        if (chrome?.storage?.local) {
            chrome.storage.local
                .set({ [THEME_KEY]: newTheme })
                .catch((err) => logger.error(err));
        }
    };

    const setFontSize = (newSize: FontSize) => {
        setFontSizeState(newSize);
        if (chrome?.storage?.local) {
            chrome.storage.local
                .set({ [FONT_SIZE_KEY]: newSize })
                .catch((err) => logger.error(err));
        }
    };

    const setFontWeight = (newWeight: FontWeight) => {
        setFontWeightState(newWeight);
        if (chrome?.storage?.local) {
            chrome.storage.local
                .set({ [FONT_WEIGHT_KEY]: newWeight })
                .catch((err) => logger.error(err));
        }
    };

    const base = fontSizeClassMap[fontSize];
    const weight = fontWeightClassMap[fontWeight];

    const fontClasses = {
        fontHeading: `${base.heading} ${weight}`,
        fontCommon: `${base.common} ${weight}`,
        fontCaption: `${base.caption} ${weight}`,
    };

    return (
        <AppThemeContext.Provider
            value={{
                theme,
                setTheme,
                fontSize,
                setFontSize,
                fontWeight,
                setFontWeight,
                fontClasses,
            }}
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
