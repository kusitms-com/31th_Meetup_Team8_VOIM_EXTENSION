import React from "react";
import { createRoot } from "react-dom/client";
// import {
//     MessageType,
//     FontSizeType,
//     FontWeightType,
//     ModeType,
//     UserSettings,
//     FontStyle,
// } from "./types";
import { fontSizeMap, fontWeightMap, targetSelectors } from "./constants";
import {
    applyFontStyle,
    applyModeStyle,
    applyCursorStyle,
    removeCursorStyle,
} from "./styles";
import {
    checkExtensionState,
    removeAllStyles,
    restoreAllStyles,
    saveSettings,
    initCursorSettings,
} from "./storage/settingsManager";
import { ControlImage } from "../components/imageCheck/controlImage";
import { FoodComponent } from "../components/productComponents/foodComponent";
const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";

interface ModeStyle {
    backgroundColor: string;
    color: string;
}

interface FontStyle {
    fontSize?: string;
    fontWeight?: string;
}

interface UserSettings {
    fontSize?: string;
    fontWeight?: string;
    mode?: ModeType;
}

type FontSizeType =
    | "SET_FONT_SIZE_XS"
    | "SET_FONT_SIZE_S"
    | "SET_FONT_SIZE_M"
    | "SET_FONT_SIZE_L"
    | "SET_FONT_SIZE_XL";
type FontWeightType =
    | "SET_FONT_WEIGHT_REGULAR"
    | "SET_FONT_WEIGHT_BOLD"
    | "SET_FONT_WEIGHT_XBOLD";
type ModeType = "SET_MODE_LIGHT" | "SET_MODE_DARK";
type MessageType =
    | FontSizeType
    | FontWeightType
    | ModeType
    | "DISABLE_ALL_STYLES"
    | "RESTORE_ALL_STYLES";

// const fontSizeMap: Record<FontSizeType, string> = {
//     SET_FONT_SIZE_XS: "0.875rem",
//     SET_FONT_SIZE_S: "1rem",
//     SET_FONT_SIZE_M: "1.125rem",
//     SET_FONT_SIZE_L: "1.25rem",
//     SET_FONT_SIZE_XL: "1.5rem",
// };

let contentCursorEnabled = true;

checkExtensionState();

document.addEventListener("DOMContentLoaded", () => {
    checkExtensionState();
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        checkExtensionState();
    }
});

initCursorSettings();

chrome.runtime.onMessage.addListener(
    (message: { type: MessageType; settings?: any }, sender, sendResponse) => {
        const { type } = message;

        console.log("메시지 수신:", type);

        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            if (
                !stylesEnabled &&
                type !== "RESTORE_ALL_STYLES" &&
                type !== "DISABLE_ALL_STYLES"
            ) {
                console.log(
                    "스타일이 비활성화 상태입니다. 메시지를 처리하지 않습니다:",
                    type,
                );
                sendResponse({
                    success: false,
                    error: "스타일이 비활성화 상태입니다",
                });
                return;
            }

            if (Object.keys(fontSizeMap).includes(type as string)) {
                const fontSizeType = type as FontSizeType;
                const fontSize = fontSizeMap[fontSizeType];
                applyFontStyle({ fontSize });
                saveSettings({ fontSize });
                sendResponse({ success: true });
            } else if (Object.keys(fontWeightMap).includes(type as string)) {
                const fontWeightType = type as FontWeightType;
                const fontWeight = fontWeightMap[fontWeightType];
                applyFontStyle({ fontWeight });
                saveSettings({ fontWeight });
                sendResponse({ success: true });
            } else if (type === "SET_MODE_LIGHT" || type === "SET_MODE_DARK") {
                const modeType = type as ModeType;
                applyModeStyle(modeType);
                saveSettings({ mode: modeType });
                sendResponse({ success: true });
            } else if (type === "DISABLE_ALL_STYLES") {
                removeAllStyles();
                sendResponse({ success: true });
            } else if (type === "RESTORE_ALL_STYLES") {
                restoreAllStyles();
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: "알 수 없는 메시지" });
            }
        });

        return true;
    },
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_CURSOR") {
        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            if (!stylesEnabled) {
                console.log(
                    "스타일이 비활성화 상태입니다. 커서 설정을 적용하지 않습니다.",
                );
                sendResponse({
                    success: false,
                    error: "스타일이 비활성화 상태입니다",
                });
                return;
            }

            if (message.isCursorEnabled && message.cursorUrl) {
                applyCursorStyle(message.cursorUrl);
                contentCursorEnabled = true;
            } else {
                removeCursorStyle();
                contentCursorEnabled = false;
            }

            sendResponse({ success: true });
        });
        return true;
    }
    return false;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TOGGLE_MODAL") {
        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            const iframe = document.getElementById(
                "floating-button-extension-iframe",
            );
            if (iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: "TOGGLE_MODAL" }, "*");
            }
            sendResponse({ success: true });
        });
        return true;
    } else if (message.action === "TOGGLE_CURSOR") {
        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            if (!stylesEnabled) {
                console.log(
                    "스타일이 비활성화 상태입니다. 커서 토글을 적용하지 않습니다.",
                );
                sendResponse({
                    success: false,
                    error: "스타일이 비활성화 상태입니다",
                });
                return;
            }

            const iframe = document.getElementById(
                "floating-button-extension-iframe",
            );
            if (iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    { type: "TOGGLE_CURSOR" },
                    "*",
                );
            }
            sendResponse({ success: true });
        });
        return true;
    }

    return false;
});

const observer = new MutationObserver((mutations) => {
    chrome.storage.sync.get(["userSettings"], (result) => {
        const settings: UserSettings = result.userSettings || {};

        if (settings.fontSize || settings.fontWeight) {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    const fontStyle: FontStyle = {};
                    if (settings.fontSize)
                        fontStyle.fontSize = settings.fontSize;
                    if (settings.fontWeight)
                        fontStyle.fontWeight = settings.fontWeight;

                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as HTMLElement;
                            if (settings.fontSize)
                                element.style.fontSize = settings.fontSize;
                            if (settings.fontWeight)
                                element.style.fontWeight = settings.fontWeight;

                            const childElements = element.querySelectorAll(
                                targetSelectors.join(","),
                            );
                            childElements.forEach((childEl) => {
                                const htmlChildEl = childEl as HTMLElement;
                                if (settings.fontSize)
                                    htmlChildEl.style.fontSize =
                                        settings.fontSize;
                                if (settings.fontWeight)
                                    htmlChildEl.style.fontWeight =
                                        settings.fontWeight;
                            });
                        }
                    });
                }
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
function isIgnorableImage(img: HTMLImageElement): boolean {
    const alt = img.alt?.toLowerCase();
    const className = img.className?.toLowerCase();
    const src = img.src?.toLowerCase();
    const anchor = img.closest("a");
    const isLinked = !!(anchor && anchor.href && anchor.href !== "#");

    return (
        isLinked ||
        alt.includes("logo") ||
        alt.includes("coupang") ||
        className.includes("logo") ||
        className.includes("icon") ||
        src.includes("logo") ||
        src.includes("sprite") ||
        img.width < 40 ||
        img.height < 40
    );
}

document.querySelectorAll("img").forEach((img) => {
    if (img.getAttribute("data-webeye-injected") === "true") return;
    if (isIgnorableImage(img)) return;

    img.setAttribute("data-webeye-injected", "true");

    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<ControlImage targetImg={img} />);
});

function checkCategoryAndRender() {
    const breadcrumbEl = document.querySelector("#breadcrumb");
    if (!breadcrumbEl) {
        console.log("#breadcrumb 엘리먼트를 찾을 수 없음");
        return;
    }

    const rawText = breadcrumbEl.textContent || "";
    console.log("원본 breadcrumb textContent:", rawText);

    const cleanedText = rawText.replace(/\s+/g, "");
    console.log("공백 제거된 breadcrumb 텍스트:", cleanedText);

    const isFoodCategory = cleanedText.includes("식품");

    if (!isFoodCategory) {
        return;
    }

    if (document.getElementById("voim-food-component")) {
        return;
    }
    const container = document.createElement("div");
    container.id = "webeye-food-component";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<FoodComponent />);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        checkCategoryAndRender();
    });
} else {
    checkCategoryAndRender();
}
