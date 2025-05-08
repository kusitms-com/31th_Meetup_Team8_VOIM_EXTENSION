import { MessageType, FontSizeType, FontWeightType, ModeType } from "./types";
import { fontSizeMap, fontWeightMap } from "./constants";
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
    loadAndApplySettings,
    initCursorSettings,
    getStylesEnabledState,
} from "./storage/settingsManager";
import { initDomObserver } from "./observers/domObserver";

// 커서 관련 상태 변수
let contentCursorEnabled = true;

// 확장 프로그램 상태 확인 및 초기화
checkExtensionState();

// DOMContentLoaded 이벤트 핸들러
document.addEventListener("DOMContentLoaded", () => {
    checkExtensionState();
});

// 페이지 가시성 변경 이벤트 (탭 전환 시 설정 재확인을 위함)
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        checkExtensionState();
    }
});

// 커서 설정 초기화
initCursorSettings();

// DOM 변경 감지 observer 초기화
const observer = initDomObserver(() => {
    // 스토리지에서 실시간으로 활성화 상태 체크
    let isStylesEnabled = true;
    chrome.storage.sync.get(["stylesEnabled"], (result) => {
        isStylesEnabled =
            result.stylesEnabled !== undefined ? result.stylesEnabled : true;
    });
    return isStylesEnabled;
});

// 크롬 메시지 리스너 - 메시지 타입에 따른 스타일 변경
chrome.runtime.onMessage.addListener(
    (message: { type: MessageType; settings?: any }, sender, sendResponse) => {
        const { type } = message;

        console.log("메시지 수신:", type);

        // 스타일 활성화 상태 확인 후 메시지 처리
        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            // DISABLE_ALL_STYLES와 RESTORE_ALL_STYLES는 항상 처리, 다른 메시지는 스타일이 활성화된 경우에만 처리
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

// 커서 업데이트 메시지 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_CURSOR") {
        // 스타일 활성화 상태 확인
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

// 모달 및 커서 토글 메시지 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TOGGLE_MODAL") {
        // 스타일 활성화 상태 확인
        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            // 스타일이 비활성화 상태여도 모달 토글은 허용 (사용자가 다시 활성화할 수 있도록)
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
        // 스타일 활성화 상태 확인
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
