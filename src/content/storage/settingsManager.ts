import { FontStyle } from "../types";
import { applyFontStyle } from "../styles/fontStyles";
import { applyModeStyle } from "../styles/modeStyles";
import { applyCursorStyle, removeCursorStyle } from "../styles/cursorStyles";
import {
    createIframe,
    removeIframe,
    restoreIframe,
} from "../iframe/iframeManager";
import { removeStyleFromIframes } from "../styles/cursorStyles";
import {
    STORAGE_KEYS,
    DEFAULT_THEME,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
} from "../../background/constants";
import { fontSizeMap, fontWeightMap, modeStyleMap } from "../constants";
import { FontSizeType, FontWeightType, ModeType } from "../types";

let originalSettings: {
    fontSize?: string;
    fontWeight?: string;
    mode?: string;
} | null = null;
let contentCursorEnabled = true;

/**
 * 확장 프로그램의 상태를 확인하고 적절히 처리합니다.
 */
export function checkExtensionState(): void {
    chrome.storage.sync.get([STORAGE_KEYS.STYLES_ENABLED], (result) => {
        const stylesEnabled = result[STORAGE_KEYS.STYLES_ENABLED] ?? true;

        if (stylesEnabled) {
            loadAndApplySettings();
            if (!iframeVisible()) {
                createIframe();
            }
        } else {
            ensureStylesRemoved();
            if (iframeVisible()) {
                removeIframe();
            }
        }
    });
}

/**
 * 현재 스타일 활성화 상태를 가져옵니다.
 */
export function getStylesEnabledState(
    callback: (enabled: boolean) => void,
): void {
    chrome.storage.sync.get([STORAGE_KEYS.STYLES_ENABLED], (result) => {
        const stylesEnabled = result[STORAGE_KEYS.STYLES_ENABLED] ?? true;
        callback(stylesEnabled);
    });
}

/**
 * iframe의 가시성 상태를 확인합니다.
 */
function iframeVisible(): boolean {
    return document.getElementById("floating-button-extension-iframe") !== null;
}

/**
 * 모든 스타일이 제거되었는지 확인하고 제거합니다.
 */
function ensureStylesRemoved(): void {
    const modeStyle = document.getElementById("webeye-mode-style");
    if (modeStyle) {
        modeStyle.remove();
    }

    const fontStyle = document.getElementById("webeye-global-font-style");
    if (fontStyle) {
        fontStyle.remove();
    }

    const cursorStyle = document.getElementById("custom-cursor-style");
    if (cursorStyle) {
        document.head.removeChild(cursorStyle);
    }

    removeStyleFromIframes();
}

/**
 * 모든 스타일을 제거합니다.
 */
export function removeAllStyles(): void {
    chrome.storage.sync.get(
        [
            STORAGE_KEYS.FONT_SIZE,
            STORAGE_KEYS.FONT_WEIGHT,
            STORAGE_KEYS.THEME_MODE,
        ],
        (result) => {
            originalSettings = {
                fontSize: result[STORAGE_KEYS.FONT_SIZE],
                fontWeight: result[STORAGE_KEYS.FONT_WEIGHT],
                mode: result[STORAGE_KEYS.THEME_MODE],
            };

            chrome.storage.sync.set(
                { [STORAGE_KEYS.STYLES_ENABLED]: false },
                () => {
                    console.log("스타일 비활성화 상태 저장됨");

                    const elements = document.querySelectorAll("*");
                    elements.forEach((el) => {
                        const htmlEl = el as HTMLElement;
                        if (htmlEl.style) {
                            htmlEl.style.removeProperty("fontSize");
                            htmlEl.style.removeProperty("fontWeight");
                            htmlEl.style.removeProperty("filter");
                            htmlEl.style.removeProperty("backgroundColor");
                        }
                    });

                    const modeStyle =
                        document.getElementById("webeye-mode-style");
                    if (modeStyle) {
                        modeStyle.remove();
                    }

                    const globalFontStyle = document.getElementById(
                        "webeye-global-font-style",
                    );
                    if (globalFontStyle) {
                        globalFontStyle.remove();
                    }

                    const cursorStyle = document.getElementById(
                        "custom-cursor-style",
                    );
                    if (cursorStyle) {
                        document.head.removeChild(cursorStyle);
                    }

                    // 폰트 스타일 관련 추가 제거
                    const fontStyles = document.querySelectorAll(
                        '[style*="font-size"], [style*="font-weight"]',
                    );
                    fontStyles.forEach((el) => {
                        const htmlEl = el as HTMLElement;
                        htmlEl.style.removeProperty("font-size");
                        htmlEl.style.removeProperty("font-weight");
                    });

                    removeStyleFromIframes();

                    console.log("모든 스타일과 iframe이 제거되었습니다.");
                },
            );
        },
    );
}

/**
 * 모든 스타일을 복원합니다.
 */
export function restoreAllStyles(): void {
    chrome.storage.sync.set({ [STORAGE_KEYS.STYLES_ENABLED]: true }, () => {
        console.log("스타일 활성화 상태 저장됨");

        chrome.storage.sync.get(
            [
                STORAGE_KEYS.FONT_SIZE,
                STORAGE_KEYS.FONT_WEIGHT,
                STORAGE_KEYS.THEME_MODE,
            ],
            (result) => {
                console.log("Restore Settings Result:", result);
                const settings = {
                    fontSize:
                        result[STORAGE_KEYS.FONT_SIZE] ??
                        originalSettings?.fontSize ??
                        DEFAULT_FONT_SIZE,
                    fontWeight:
                        result[STORAGE_KEYS.FONT_WEIGHT] ??
                        originalSettings?.fontWeight ??
                        DEFAULT_FONT_WEIGHT,
                    mode:
                        result[STORAGE_KEYS.THEME_MODE] ??
                        originalSettings?.mode ??
                        DEFAULT_THEME,
                };

                // 키워드를 실제 CSS 값 또는 메시지 타입으로 변환
                const fontSizePixel =
                    fontSizeMap[
                        `SET_FONT_SIZE_${settings.fontSize.toUpperCase()}` as FontSizeType
                    ];
                const fontWeightPixel =
                    fontWeightMap[
                        `SET_FONT_WEIGHT_${settings.fontWeight.toUpperCase()}` as FontWeightType
                    ];
                const modeMessageType =
                    `SET_MODE_${settings.mode.toUpperCase()}` as ModeType;

                setTimeout(() => {
                    if (modeMessageType) {
                        applyModeStyle(modeMessageType); // 변환된 메시지 타입 사용
                    }

                    const fontStyle: Partial<FontStyle> = {};
                    if (fontSizePixel) fontStyle.fontSize = fontSizePixel; // 변환된 픽셀 값 사용
                    if (fontWeightPixel) fontStyle.fontWeight = fontWeightPixel; // 변환된 픽셀 값 또는 CSS 키워드 사용
                    if (Object.keys(fontStyle).length) {
                        applyFontStyle(fontStyle);
                    }

                    restoreIframe();

                    console.log("모든 스타일과 iframe이 복원되었습니다.");
                }, 100);
            },
        );

        chrome.runtime.sendMessage(
            { type: "GET_CURSOR_SETTINGS" },
            (response) => {
                if (
                    response &&
                    response.isCursorEnabled &&
                    response.cursorUrl
                ) {
                    applyCursorStyle(response.cursorUrl);
                    contentCursorEnabled = true;
                } else {
                    removeCursorStyle(); // 커서 비활성화 상태 처리 추가
                }
            },
        );
    });
}

/**
 * 사용자 설정을 저장합니다.
 * @param settings 저장할 설정 객체
 */
export function saveSettings(settings: {
    fontSize?: string;
    fontWeight?: string;
    mode?: string;
}): void {
    const updates: Record<string, string> = {};
    if (settings.fontSize) updates[STORAGE_KEYS.FONT_SIZE] = settings.fontSize;
    if (settings.fontWeight)
        updates[STORAGE_KEYS.FONT_WEIGHT] = settings.fontWeight;
    if (settings.mode) updates[STORAGE_KEYS.THEME_MODE] = settings.mode;

    chrome.storage.sync.set(updates, () => {
        console.log("Settings saved:", updates);
    });
}

/**
 * 설정을 로드하고 페이지에 적용합니다.
 */
export function loadAndApplySettings(): void {
    chrome.storage.sync.get(
        [
            STORAGE_KEYS.FONT_SIZE,
            STORAGE_KEYS.FONT_WEIGHT,
            STORAGE_KEYS.THEME_MODE,
            STORAGE_KEYS.STYLES_ENABLED,
        ],
        (result) => {
            const stylesEnabled = result[STORAGE_KEYS.STYLES_ENABLED] ?? true;

            console.log(
                "Loaded settings:",
                result,
                "Styles enabled:",
                stylesEnabled,
            );

            if (!stylesEnabled) {
                console.log(
                    "스타일이 비활성화 상태입니다. 설정을 적용하지 않습니다.",
                );
                return;
            }

            const fontSize =
                result[STORAGE_KEYS.FONT_SIZE] ?? DEFAULT_FONT_SIZE;
            const fontWeight =
                result[STORAGE_KEYS.FONT_WEIGHT] ?? DEFAULT_FONT_WEIGHT;
            const themeMode = result[STORAGE_KEYS.THEME_MODE] ?? DEFAULT_THEME;

            // 키워드를 실제 CSS 값 또는 메시지 타입으로 변환
            const fontSizePixel =
                fontSizeMap[
                    `SET_FONT_SIZE_${fontSize.toUpperCase()}` as FontSizeType
                ];
            const fontWeightPixel =
                fontWeightMap[
                    `SET_FONT_WEIGHT_${fontWeight.toUpperCase()}` as FontWeightType
                ];
            const modeMessageType =
                `SET_MODE_${themeMode.toUpperCase()}` as ModeType;

            // 테마 모드 적용
            if (modeMessageType) {
                applyModeStyle(modeMessageType); // 변환된 메시지 타입 사용
            }

            const fontStyle: Partial<FontStyle> = {
                fontSize: fontSizePixel, // 변환된 픽셀 값 사용
                fontWeight: fontWeightPixel, // 변환된 픽셀 값 또는 CSS 키워드 사용
            };

            if (fontStyle.fontSize || fontStyle.fontWeight) {
                applyFontStyle(fontStyle);
            }
        },
    );
}

/**
 * 커서 설정을 초기화합니다.
 */
export function initCursorSettings(): void {
    contentCursorEnabled = true;

    chrome.storage.sync.get([STORAGE_KEYS.STYLES_ENABLED], (result) => {
        const stylesEnabled = result[STORAGE_KEYS.STYLES_ENABLED] ?? true;

        if (!stylesEnabled) {
            console.log(
                "스타일이 비활성화 상태입니다. 커서 설정을 적용하지 않습니다.",
            );
            return;
        }

        chrome.runtime.sendMessage(
            { type: "GET_CURSOR_SETTINGS" },
            (response) => {
                if (response) {
                    contentCursorEnabled = response.isCursorEnabled;

                    if (contentCursorEnabled && response.cursorUrl) {
                        applyCursorStyle(response.cursorUrl);
                    } else {
                        removeCursorStyle();
                    }
                }
            },
        );
    });
}
