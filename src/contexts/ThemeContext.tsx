import { logger } from "@src/utils/logger";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ModeType } from "@src/content/types";

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
    resetSettings: () => void;
}

export const AppThemeContext = createContext<AppThemeContextValue | undefined>(
    undefined,
);

const THEME_KEY = "theme-mode";
const FONT_SIZE_KEY = "font-size";
const FONT_WEIGHT_KEY = "font-weight";

const DEFAULT_THEME: ThemeMode = "light";
const DEFAULT_FONT_SIZE: FontSize = "m";
const DEFAULT_FONT_WEIGHT: FontWeight = "bold";

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

// 테마 모드 변환 함수
const convertToThemeMode = (mode: string): ThemeMode => {
    if (mode === "SET_MODE_DARK") return "dark";
    if (mode === "SET_MODE_LIGHT") return "light";
    return DEFAULT_THEME;
};

const convertToModeType = (theme: ThemeMode): ModeType => {
    return theme === "dark" ? "SET_MODE_DARK" : "SET_MODE_LIGHT";
};

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
    const [fontSize, setFontSizeState] = useState<FontSize>(DEFAULT_FONT_SIZE);
    const [fontWeight, setFontWeightState] =
        useState<FontWeight>(DEFAULT_FONT_WEIGHT);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!chrome?.storage?.sync) {
            setIsLoading(false);
            return;
        }

        const loadSettings = async () => {
            try {
                const result = await chrome.storage.sync.get([
                    THEME_KEY,
                    FONT_SIZE_KEY,
                    FONT_WEIGHT_KEY,
                ]);

                if (result[THEME_KEY]) {
                    setThemeState(convertToThemeMode(result[THEME_KEY]));
                }
                if (
                    ["xl", "l", "m", "s", "xs"].includes(result[FONT_SIZE_KEY])
                ) {
                    setFontSizeState(result[FONT_SIZE_KEY]);
                }
                if (
                    ["xbold", "bold", "regular"].includes(
                        result[FONT_WEIGHT_KEY],
                    )
                ) {
                    setFontWeightState(result[FONT_WEIGHT_KEY]);
                }
            } catch (error) {
                logger.error("설정 로드 중 오류:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();

        const handleStorageChange = (changes: {
            [key: string]: chrome.storage.StorageChange;
        }) => {
            if (changes[THEME_KEY]) {
                const newTheme = changes[THEME_KEY].newValue;
                setThemeState(convertToThemeMode(newTheme));
            }
            if (changes[FONT_SIZE_KEY]) {
                const newSize = changes[FONT_SIZE_KEY].newValue;
                if (["xl", "l", "m", "s", "xs"].includes(newSize)) {
                    setFontSizeState(newSize);
                }
            }
            if (changes[FONT_WEIGHT_KEY]) {
                const newWeight = changes[FONT_WEIGHT_KEY].newValue;
                if (["xbold", "bold", "regular"].includes(newWeight)) {
                    setFontWeightState(newWeight);
                }
            }
        };

        chrome.storage.sync.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.sync.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    if (isLoading) {
        return null; // 또는 로딩 스피너를 표시할 수 있습니다
    }

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        if (chrome?.storage?.sync) {
            const modeType = convertToModeType(newTheme);
            chrome.storage.sync
                .set({ [THEME_KEY]: modeType })
                .catch((err) => logger.error(err));

            // 메시지 전송
            chrome.runtime.sendMessage({ type: modeType }, (response) => {
                if (chrome.runtime.lastError) {
                    logger.error(
                        "메시지 전송 오류:",
                        chrome.runtime.lastError.message,
                    );
                }
            });
        }
    };

    const setFontSize = (newSize: FontSize) => {
        setFontSizeState(newSize);
        if (chrome?.storage?.sync) {
            chrome.storage.sync
                .set({ [FONT_SIZE_KEY]: newSize })
                .catch((err) => logger.error(err));
        }
    };

    const setFontWeight = (newWeight: FontWeight) => {
        setFontWeightState(newWeight);
        if (chrome?.storage?.sync) {
            chrome.storage.sync
                .set({ [FONT_WEIGHT_KEY]: newWeight })
                .catch((err) => logger.error(err));
        }
    };

    const resetSettings = () => {
        setTheme(DEFAULT_THEME);
        setFontSize(DEFAULT_FONT_SIZE);
        setFontWeight(DEFAULT_FONT_WEIGHT);

        if (chrome?.storage?.sync) {
            chrome.storage.sync
                .set({
                    [THEME_KEY]: DEFAULT_THEME,
                    [FONT_SIZE_KEY]: DEFAULT_FONT_SIZE,
                    [FONT_WEIGHT_KEY]: DEFAULT_FONT_WEIGHT,
                })
                .then(() => {
                    logger.debug("설정이 초기화되었습니다.");
                })
                .catch((err) => logger.error("설정 초기화 중 오류:", err));
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
                resetSettings,
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
