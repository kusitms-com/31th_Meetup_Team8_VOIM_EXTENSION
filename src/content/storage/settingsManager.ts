import { UserSettings } from "../types";
import { applyFontStyle } from "../styles/fontStyles";
import { applyModeStyle } from "../styles/modeStyles";
import { applyCursorStyle, removeCursorStyle } from "../styles/cursorStyles";
import {
    createIframe,
    removeIframe,
    restoreIframe,
} from "../iframe/iframeManager";
import { removeStyleFromIframes } from "../styles/cursorStyles";
import { targetSelectors } from "../constants";

// 설정 관련 기본값
let originalSettings: UserSettings | null = null;
let contentCursorEnabled = true;

/**
 * 확장 프로그램의 상태를 확인하고 적절히 처리합니다.
 */
export function checkExtensionState(): void {
    chrome.storage.sync.get(["stylesEnabled"], (result) => {
        const stylesEnabled =
            result.stylesEnabled !== undefined ? result.stylesEnabled : true;

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
    chrome.storage.sync.get(["stylesEnabled"], (result) => {
        const stylesEnabled =
            result.stylesEnabled !== undefined ? result.stylesEnabled : true;
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
    // 1. 인라인 스타일 제거
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style) {
            htmlEl.style.removeProperty("fontSize");
            htmlEl.style.removeProperty("fontWeight");
        }
    });

    // 2. 모드 스타일 제거
    const modeStyle = document.getElementById("webeye-mode-style");
    if (modeStyle) {
        modeStyle.remove();
    }

    // 3. 전역 폰트 스타일 제거
    const fontStyle = document.getElementById("webeye-global-font-style");
    if (fontStyle) {
        fontStyle.remove();
    }

    // 4. 커서 스타일 제거
    const cursorStyle = document.getElementById("custom-cursor-style");
    if (cursorStyle) {
        document.head.removeChild(cursorStyle);
    }

    // 5. iframe 내 스타일 제거
    removeStyleFromIframes();
}

/**
 * 모든 스타일을 제거합니다.
 */
export function removeAllStyles(): void {
    chrome.storage.sync.get(["userSettings"], (result) => {
        // 원본 설정 저장
        originalSettings = result.userSettings || {};

        // 1. 먼저 스타일을 비활성화 상태로 저장 (다른 함수에서 확인 가능하도록)
        chrome.storage.sync.set({ stylesEnabled: false }, () => {
            console.log("스타일 비활성화 상태 저장됨");

            // 2. 인라인 스타일 제거
            const elements = document.querySelectorAll("*");
            elements.forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (htmlEl.style) {
                    htmlEl.style.removeProperty("fontSize");
                    htmlEl.style.removeProperty("fontWeight");
                }
            });

            // 3. 모드 스타일 제거
            const modeStyle = document.getElementById("webeye-mode-style");
            if (modeStyle) {
                modeStyle.remove();
            }

            // 4. 글로벌 폰트 스타일 제거
            const globalFontStyle = document.getElementById(
                "webeye-global-font-style",
            );
            if (globalFontStyle) {
                globalFontStyle.remove();
            }

            // 5. 폰트 스타일 전역 리셋 (중요: 기본값으로 강제 초기화)
            const resetStyle = document.createElement("style");
            resetStyle.id = "webeye-reset-style";
            resetStyle.textContent = `
                * {
                    font-size: initial !important;
                    font-weight: initial !important;
                }
                
                body, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, select, li, ul, ol {
                    font-size: initial !important;
                    font-weight: initial !important;
                }
            `;
            document.head.appendChild(resetStyle);

            // 6. 커서 스타일 제거
            const cursorStyle = document.getElementById("custom-cursor-style");
            if (cursorStyle) {
                document.head.removeChild(cursorStyle);
            }

            // 7. iframe 내 스타일 제거
            removeStyleFromIframes();

            // 8. 플로팅 iframe 제거
            removeIframe();

            console.log("모든 스타일과 iframe이 제거되었습니다.");

            // 9. 모든 요소에 !important 스타일 적용 후, 약간의 지연 후에 제거
            // 이렇게 하면 모든 DOM 변경이 처리된 후 리셋 스타일이 제거됨
            setTimeout(() => {
                const resetStyleElem =
                    document.getElementById("webeye-reset-style");
                if (resetStyleElem) {
                    // 리셋 스타일 유지 (제거하지 않음)
                    // 페이지 로드마다 스타일이 다시 적용되지 않도록 함
                    // resetStyleElem.remove();
                }
            }, 500);
        });
    });
}

/**
 * 모든 스타일을 복원합니다.
 */
/**
 * 모든 스타일을 복원합니다.
 */
export function restoreAllStyles(): void {
    // 1. 먼저, 스타일을 활성화 상태로 저장 (다른 함수에서 확인 가능하도록)
    chrome.storage.sync.set({ stylesEnabled: true }, () => {
        console.log("스타일 활성화 상태 저장됨");

        // 2. 리셋 스타일이 있다면 제거
        const resetStyle = document.getElementById("webeye-reset-style");
        if (resetStyle) {
            resetStyle.remove();
        }

        // 3. 이전 설정을 가져와서 적용
        chrome.storage.sync.get(["userSettings"], (result) => {
            const settings = result.userSettings || originalSettings || {};

            // 작은 지연을 통해 리셋 스타일이 완전히 제거된 후 적용
            setTimeout(() => {
                // 폰트 스타일 적용
                if (settings.fontSize) {
                    applyFontStyle({ fontSize: settings.fontSize });
                }

                if (settings.fontWeight) {
                    applyFontStyle({ fontWeight: settings.fontWeight });
                }

                // 모드 스타일 적용
                if (settings.mode) {
                    applyModeStyle(settings.mode);
                }

                // iframe 복원
                restoreIframe();

                console.log("모든 스타일과 iframe이 복원되었습니다.");
            }, 100);
        });

        // 4. 커서 스타일 복원
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
                }
            },
        );
    });
}

/**
 * 사용자 설정을 저장합니다.
 * @param settings 저장할 설정 객체
 */
export function saveSettings(settings: Partial<UserSettings>): void {
    chrome.storage.sync.get(["userSettings"], (result) => {
        const currentSettings: UserSettings = result.userSettings || {};
        const updatedSettings = { ...currentSettings, ...settings };

        chrome.storage.sync.set({ userSettings: updatedSettings }, () => {
            console.log("Settings saved:", updatedSettings);
        });
    });
}

/**
 * 설정을 로드하고 페이지에 적용합니다.
 */
export function loadAndApplySettings(): void {
    chrome.storage.sync.get(["userSettings", "stylesEnabled"], (result) => {
        const settings: UserSettings = result.userSettings || {};
        const stylesEnabled =
            result.stylesEnabled !== undefined ? result.stylesEnabled : true;

        console.log(
            "Loaded settings:",
            settings,
            "Styles enabled:",
            stylesEnabled,
        );

        // 스타일이 비활성화 상태면 적용하지 않음
        if (!stylesEnabled) {
            console.log(
                "스타일이 비활성화 상태입니다. 설정을 적용하지 않습니다.",
            );
            return;
        }

        if (settings.fontSize) {
            applyFontStyle({ fontSize: settings.fontSize });
        }

        if (settings.fontWeight) {
            applyFontStyle({ fontWeight: settings.fontWeight });
        }

        if (settings.mode) {
            applyModeStyle(settings.mode);
        }
    });
}

/**
 * 커서 설정을 초기화합니다.
 */
export function initCursorSettings(): void {
    contentCursorEnabled = true;

    chrome.storage.sync.get(["stylesEnabled"], (result) => {
        const stylesEnabled =
            result.stylesEnabled !== undefined ? result.stylesEnabled : true;

        // 스타일이 비활성화 상태면 커서 설정을 적용하지 않음
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
