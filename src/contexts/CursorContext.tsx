import { getExtensionUrl } from "@src/utils/getExtensionUrl";
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

const applyCursorStyle = (theme: CursorTheme, size: CursorSize) => {
    try {
        const cursorUrl = getExtensionUrl(cursorImages[theme][size]);

        const styleContent = `
            body, button, a, input, select, textarea {
                cursor: url('${cursorUrl}'), auto !important;
            }
        `;

        // 부모 문서에 적용
        const existingStyle = document.getElementById("custom-cursor-style");
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
        const styleElement = document.createElement("style");
        styleElement.id = "custom-cursor-style";
        styleElement.textContent = styleContent;
        document.head.appendChild(styleElement);

        // iframe 내부에도 적용
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
            try {
                const iframeDoc =
                    iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    const existingIframeStyle = iframeDoc.getElementById(
                        "custom-cursor-style",
                    );
                    if (existingIframeStyle) {
                        iframeDoc.head.removeChild(existingIframeStyle);
                    }
                    const iframeStyle = iframeDoc.createElement("style");
                    iframeStyle.id = "custom-cursor-style";
                    iframeStyle.textContent = styleContent;
                    iframeDoc.head.appendChild(iframeStyle);
                }
            } catch (e) {
                console.warn(
                    "iframe 커서 스타일 적용 실패 (cross-origin?):",
                    e,
                );
            }
        });

        console.log(`커서 변경: ${theme}, ${size}`);
    } catch (error) {
        console.error("커서 스타일 적용 중 오류:", error);
    }
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

    useEffect(() => {
        if (typeof document !== "undefined") {
            applyCursorStyle(cursorTheme, cursorSize);
        }
    }, [cursorTheme, cursorSize]);

    useEffect(() => {
        if (typeof document !== "undefined") {
            try {
                const cursorPath = `images/cursors/${cursorTheme}_${cursorSize}.png`;
                let cursorUrl = "";

                if (typeof chrome !== "undefined" && chrome.runtime) {
                    cursorUrl = chrome.runtime.getURL(cursorPath);
                } else {
                    cursorUrl = `/${cursorPath}`;
                }

                const existingStyle = document.getElementById(
                    "custom-cursor-style",
                );
                if (existingStyle) {
                    document.head.removeChild(existingStyle);
                }

                const styleElement = document.createElement("style");
                styleElement.id = "custom-cursor-style";
                styleElement.textContent = `
          * {
            cursor: url('${cursorUrl}'), auto !important;
          }
        `;
                document.head.appendChild(styleElement);
            } catch (error) {
                console.error(
                    "확장 프로그램 UI 커서 스타일 적용 중 오류:",
                    error,
                );
            }
        }
    }, [cursorTheme, cursorSize]);

    const setCursorTheme = (newTheme: CursorTheme) => {
        setCursorThemeState(newTheme);
        if (typeof chrome !== "undefined" && chrome.storage?.sync?.set) {
            chrome.storage.sync.set({ cursorTheme: newTheme });
        }
    };

    const setCursorSize = (newSize: CursorSize) => {
        setCursorSizeState(newSize);
        if (typeof chrome !== "undefined" && chrome.storage?.sync?.set) {
            chrome.storage.sync.set({ cursorSize: newSize });
        }
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
