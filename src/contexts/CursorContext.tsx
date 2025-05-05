import React, { createContext, useContext, useEffect, useState } from "react";

export type CursorTheme =
    | "white"
    | "purple"
    | "yellow"
    | "mint"
    | "pink"
    | "black";
export type CursorSize = "small" | "medium" | "large";

interface CursorContextValue {
    cursorTheme: CursorTheme;
    cursorSize: CursorSize;
    setCursorTheme: (theme: CursorTheme) => void;
    setCursorSize: (size: CursorSize) => void;
}

const CursorContext = createContext<CursorContextValue | undefined>(undefined);

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

export function CursorProvider({
    children,
    initialTheme = "white",
    initialSize = "medium",
}: {
    children: React.ReactNode;
    initialTheme?: CursorTheme;
    initialSize?: CursorSize;
}) {
    const [cursorTheme, setCursorThemeState] =
        useState<CursorTheme>(initialTheme);
    const [cursorSize, setCursorSizeState] = useState<CursorSize>(initialSize);

    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.get(["cursorTheme", "cursorSize"], (result) => {
                if (
                    result.cursorTheme &&
                    Object.keys(cursorImages).includes(result.cursorTheme)
                ) {
                    setCursorThemeState(result.cursorTheme as CursorTheme);
                }

                if (
                    result.cursorSize &&
                    ["small", "medium", "large"].includes(result.cursorSize)
                ) {
                    setCursorSizeState(result.cursorSize as CursorSize);
                }
            });
        }
    }, []);

    const setCursorTheme = (newTheme: CursorTheme) => {
        setCursorThemeState(newTheme);
        chrome.storage?.sync?.set?.({ cursorTheme: newTheme });
    };

    const setCursorSize = (newSize: CursorSize) => {
        setCursorSizeState(newSize);
        chrome.storage.sync.set({ cursorSize: newSize });
    };

    return (
        <CursorContext.Provider
            value={{
                cursorTheme,
                cursorSize,
                setCursorTheme,
                setCursorSize,
            }}
        >
            {children}
        </CursorContext.Provider>
    );
}

export function useCursorTheme() {
    const context = useContext(CursorContext);
    if (!context) {
        throw new Error("useCursorTheme must be used within a CursorProvider");
    }
    return context;
}
