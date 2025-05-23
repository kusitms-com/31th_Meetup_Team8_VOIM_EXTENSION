import { initMessageListeners } from "./listeners/messageListeners";
import { initStorageListeners } from "./listeners/storageListeners";
import { initTabListeners } from "./listeners/tabListeners";
import { logger } from "@src/utils/logger";
import {
    STORAGE_KEYS,
    DEFAULT_THEME,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_CURSOR_THEME,
    DEFAULT_CURSOR_SIZE,
    DEFAULT_CURSOR_ENABLED,
} from "./constants";
import { initCommandListeners } from "./listeners/commandListeners";
import { cursorService } from "./services/cursorService";

/**
 * 백그라운드 스크립트 초기화
 */
async function init() {
    try {
        logger.debug("백그라운드 스크립트 초기화 시작");

        initCommandListeners();
        initMessageListeners();
        initStorageListeners();
        initTabListeners();

        logger.debug("모든 리스너가 초기화되었습니다");

        const result = await chrome.storage.local.get([
            STORAGE_KEYS.CURSOR_THEME,
            STORAGE_KEYS.CURSOR_SIZE,
            STORAGE_KEYS.IS_CURSOR_ENABLED,
        ]);

        if (result[STORAGE_KEYS.CURSOR_THEME]) {
            cursorService.setCursorTheme(result[STORAGE_KEYS.CURSOR_THEME]);
        }

        if (result[STORAGE_KEYS.CURSOR_SIZE]) {
            cursorService.setCursorSize(result[STORAGE_KEYS.CURSOR_SIZE]);
        }

        if (result[STORAGE_KEYS.IS_CURSOR_ENABLED] !== undefined) {
            cursorService.setCursorEnabled(
                result[STORAGE_KEYS.IS_CURSOR_ENABLED],
            );
        }

        await cursorService.updateAllTabs();

        chrome.commands.getAll().then((commands) => {
            logger.debug("사용 가능한 명령어:", commands);
        });
    } catch (error) {
        logger.error("백그라운드 스크립트 초기화 오류:", error);
    }
}

init();

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const defaultSettings = {
            [STORAGE_KEYS.THEME_MODE]: DEFAULT_THEME,
            [STORAGE_KEYS.FONT_SIZE]: DEFAULT_FONT_SIZE,
            [STORAGE_KEYS.FONT_WEIGHT]: DEFAULT_FONT_WEIGHT,
            [STORAGE_KEYS.CURSOR_THEME]: DEFAULT_CURSOR_THEME,
            [STORAGE_KEYS.CURSOR_SIZE]: DEFAULT_CURSOR_SIZE,
            [STORAGE_KEYS.IS_CURSOR_ENABLED]: DEFAULT_CURSOR_ENABLED,
        };
        chrome.storage.local.set(defaultSettings, () => {
            logger.debug(
                "확장 프로그램 설치됨: 스토리지에 기본 설정 저장 완료",
            );
        });

        chrome.storage.local.set({ iframeInvisible: false }, () => {
            logger.debug("iframe 기본 설정 저장 완료");
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_FOOD_DATA") {
        const payload = message.payload;

        fetch("https://voim.store/api/v1/products/foods", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("FOOD API 응답 성공:", data);
                if (sender.tab?.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "FOOD_DATA_RESPONSE",
                        data,
                    });
                }
            })
            .catch((err) => {
                if (sender.tab?.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "FOOD_DATA_ERROR",
                        error: err.message,
                    });
                }
            });

        return true;
    }

    if (message.type === "FETCH_IMAGE_ANALYSIS") {
        const imageUrl = message.payload?.url;

        fetch("https://voim.store/api/v1/image-analysis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: imageUrl }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("백그라운드 API 응답:", data);
                console.log("보낼 data.data:", data.data);

                if (sender.tab?.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "IMAGE_ANALYSIS_RESPONSE",
                        data: data.data,
                    });
                }

                sendResponse({
                    type: "IMAGE_ANALYSIS_RESPONSE",
                    data: data.data,
                });
            })
            .catch((err) => {
                console.error("이미지 분석 에러:", err);
                if (sender.tab?.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "IMAGE_ANALYSIS_ERROR",
                        error: err.message,
                    });
                }
                sendResponse({
                    type: "IMAGE_ANALYSIS_ERROR",
                    error: err.message,
                });
            });

        return true;
    }
});
