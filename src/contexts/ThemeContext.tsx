import React, { createContext, useContext, useEffect, useState } from "react";
import { getExtensionUrl } from "@src/utils/getExtensionUrl";

export type Theme = "light" | "dark" | "system";
export type FontSize = "xs" | "s" | "m" | "l" | "xl";
export type FontWeight = "regular" | "bold" | "xbold";
export type CursorTheme =
    | "white"
    | "purple"
    | "yellow"
    | "mint"
    | "pink"
    | "black";
export type CursorSize = "small" | "medium" | "large";

const DEFAULT_SETTINGS = {
    theme: "system" as Theme,
    fontSize: "m" as FontSize,
    fontWeight: "bold" as FontWeight,
    cursorTheme: "white" as CursorTheme,
    cursorSize: "medium" as CursorSize,
    isCursorEnabled: true,
};

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

interface ThemeContextValue {
    theme: Theme;
    fontSize: FontSize;
    fontWeight: FontWeight;
    cursorTheme: CursorTheme;
    cursorSize: CursorSize;
    isCursorEnabled: boolean;
    fontClasses: {
        fontHeading: string;
        fontCommon: string;
        fontCaption: string;
    };
    setTheme: (theme: Theme) => void;
    setFontSize: (size: FontSize) => void;
    setFontWeight: (weight: FontWeight) => void;
    setCursorTheme: (theme: CursorTheme) => void;
    setCursorSize: (size: CursorSize) => void;
    toggleCursor: () => void;
    resetSettings: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const cursorImages: Record<CursorTheme, Record<CursorSize, string>> = {
    white: {
        small: "cursors/white_small.png",
        medium: "cursors/white_medium.png",
        large: "cursors/white_large.png",
    },
    purple: {
        small: "cursors/purple_small.png",
        medium: "cursors/purple_medium.png",
        large: "cursors/purple_large.png",
    },
    yellow: {
        small: "cursors/yellow_small.png",
        medium: "cursors/yellow_medium.png",
        large: "cursors/yellow_large.png",
    },
    mint: {
        small: "cursors/mint_small.png",
        medium: "cursors/mint_medium.png",
        large: "cursors/mint_large.png",
    },
    pink: {
        small: "cursors/pink_small.png",
        medium: "cursors/pink_medium.png",
        large: "cursors/pink_large.png",
    },
    black: {
        small: "cursors/black_small.png",
        medium: "cursors/black_medium.png",
        large: "cursors/black_large.png",
    },
};

const applyCursorStyle = (
    theme: CursorTheme,
    size: CursorSize,
    enabled: boolean,
) => {
    const styleId = "custom-cursor-style";
    const cursorUrl = getExtensionUrl(cursorImages[theme][size]);

    const styleContent = enabled
        ? `body, button, a, input, select, textarea { cursor: url('${cursorUrl}'), auto !important; }`
        : "";

    const updateStyleInDocument = (doc: Document) => {
        const existing = doc.getElementById(styleId);
        if (existing) existing.remove();
        if (enabled) {
            const style = doc.createElement("style");
            style.id = styleId;
            style.textContent = styleContent;
            doc.head.appendChild(style);
        }
    };

    updateStyleInDocument(document);
    document.querySelectorAll("iframe").forEach((iframe) => {
        try {
            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) updateStyleInDocument(iframeDoc);
        } catch (e) {
            console.warn("iframe 커서 적용 실패:", e);
        }
    });
};

export function ThemeContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [theme, setThemeState] = useState<Theme>(DEFAULT_SETTINGS.theme);
    const [fontSize, setFontSizeState] = useState<FontSize>(
        DEFAULT_SETTINGS.fontSize,
    );
    const [fontWeight, setFontWeightState] = useState<FontWeight>(
        DEFAULT_SETTINGS.fontWeight,
    );
    const [cursorTheme, setCursorThemeState] = useState<CursorTheme>(
        DEFAULT_SETTINGS.cursorTheme,
    );
    const [cursorSize, setCursorSizeState] = useState<CursorSize>(
        DEFAULT_SETTINGS.cursorSize,
    );
    const [isCursorEnabled, setIsCursorEnabled] = useState<boolean>(
        DEFAULT_SETTINGS.isCursorEnabled,
    );

    // Load from chrome.storage
    useEffect(() => {
        if (chrome?.storage?.sync) {
            chrome.storage.sync.get(
                [
                    "theme",
                    "fontSize",
                    "fontWeight",
                    "cursorTheme",
                    "cursorSize",
                    "isCursorEnabled",
                ],
                (result) => {
                    if (result.theme) setThemeState(result.theme);
                    if (result.fontSize) setFontSizeState(result.fontSize);
                    if (result.fontWeight)
                        setFontWeightState(result.fontWeight);
                    if (result.cursorTheme)
                        setCursorThemeState(result.cursorTheme);
                    if (result.cursorSize)
                        setCursorSizeState(result.cursorSize);
                    if (typeof result.isCursorEnabled === "boolean")
                        setIsCursorEnabled(result.isCursorEnabled);
                },
            );
        }
    }, []);

    // Apply cursor when settings change
    useEffect(() => {
        applyCursorStyle(cursorTheme, cursorSize, isCursorEnabled);
    }, [cursorTheme, cursorSize, isCursorEnabled]);

    // Save handlers
    const saveToStorage = (key: string, value: any) => {
        if (chrome?.storage?.sync?.set)
            chrome.storage.sync.set({ [key]: value });
    };

    const setTheme = (v: Theme) => {
        setThemeState(v);
        saveToStorage("theme", v);
    };
    const setFontSize = (v: FontSize) => {
        setFontSizeState(v);
        saveToStorage("fontSize", v);
    };
    const setFontWeight = (v: FontWeight) => {
        setFontWeightState(v);
        saveToStorage("fontWeight", v);
    };
    const setCursorTheme = (v: CursorTheme) => {
        setCursorThemeState(v);
        saveToStorage("cursorTheme", v);
    };
    const setCursorSize = (v: CursorSize) => {
        setCursorSizeState(v);
        saveToStorage("cursorSize", v);
    };
    const toggleCursor = () => {
        const newState = !isCursorEnabled;
        setIsCursorEnabled(newState);
        saveToStorage("isCursorEnabled", newState);
    };
    const resetSettings = () => {
        setThemeState(DEFAULT_SETTINGS.theme);
        setFontSizeState(DEFAULT_SETTINGS.fontSize);
        setFontWeightState(DEFAULT_SETTINGS.fontWeight);
        setCursorThemeState(DEFAULT_SETTINGS.cursorTheme);
        setCursorSizeState(DEFAULT_SETTINGS.cursorSize);
        setIsCursorEnabled(DEFAULT_SETTINGS.isCursorEnabled);

        if (chrome?.storage?.sync?.set) {
            chrome.storage.sync.set({ ...DEFAULT_SETTINGS });
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
        <ThemeContext.Provider
            value={{
                theme,
                fontSize,
                fontWeight,
                cursorTheme,
                cursorSize,
                isCursorEnabled,
                fontClasses,
                setTheme,
                setFontSize,
                setFontWeight,
                setCursorTheme,
                setCursorSize,
                toggleCursor,
                resetSettings,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error(
            "useUserPreferences must be used within a UserPreferencesProvider",
        );
    return context;
}
