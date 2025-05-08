import { logger } from "./utils/logger";

interface SavedSettings {
    userSettings?: {
        fontSize?: string;
        fontWeight?: string;
        mode?: string;
    };
    isCursorEnabled?: boolean;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const allowedFontMessages = [
        "SET_FONT_SIZE_XS",
        "SET_FONT_SIZE_S",
        "SET_FONT_SIZE_M",
        "SET_FONT_SIZE_L",
        "SET_FONT_SIZE_XL",
        "SET_FONT_WEIGHT_REGULAR",
        "SET_FONT_WEIGHT_BOLD",
        "SET_FONT_WEIGHT_XBOLD",
        "SET_MODE_LIGHT",
        "SET_MODE_DARK",
    ];

    if (allowedFontMessages.includes(message.type)) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, message, (res) => {
                    sendResponse(res);
                });
            } else {
                sendResponse({ success: false, error: "탭 없음" });
            }
        });
        return true;
    }

    if (message.type === "RESET_SETTINGS") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        alert("설정이 초기화되었습니다.");
                    },
                });
            }
        });
        sendResponse({ success: true });
        return true;
    }
});

let currentCursorTheme = "white";
let currentCursorSize = "medium";
let isCursorEnabled = true;
let isDarkMode = false;
let areStylesEnabled = true;

let savedSettings: SavedSettings | null = null;

chrome.storage.sync.get(
    ["cursorTheme", "cursorSize", "isCursorEnabled", "userSettings"],
    (result) => {
        if (result.cursorTheme) {
            currentCursorTheme = result.cursorTheme;
        }
        if (result.cursorSize) {
            currentCursorSize = result.cursorSize;
        }
        if (typeof result.isCursorEnabled === "boolean") {
            isCursorEnabled = result.isCursorEnabled;
        }
        if (result.userSettings && result.userSettings.mode) {
            isDarkMode = result.userSettings.mode === "SET_MODE_DARK";
        }

        savedSettings = {
            userSettings: result.userSettings,
            isCursorEnabled: result.isCursorEnabled,
        };

        updateAllTabs();
    },
);

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync") {
        let needsUpdate = false;

        if (changes.cursorTheme) {
            currentCursorTheme = changes.cursorTheme.newValue;
            needsUpdate = true;
        }
        if (changes.cursorSize) {
            currentCursorSize = changes.cursorSize.newValue;
            needsUpdate = true;
        }
        if (changes.isCursorEnabled !== undefined) {
            isCursorEnabled = changes.isCursorEnabled.newValue;
            needsUpdate = true;
        }
        if (changes.userSettings) {
            if (
                changes.userSettings.newValue &&
                changes.userSettings.newValue.mode
            ) {
                isDarkMode =
                    changes.userSettings.newValue.mode === "SET_MODE_DARK";
            }

            if (savedSettings !== null) {
                savedSettings = {
                    ...savedSettings,
                    userSettings: changes.userSettings.newValue,
                };
            } else {
                savedSettings = {
                    userSettings: changes.userSettings.newValue,
                };
            }

            needsUpdate = true;
        }

        if (needsUpdate) {
            updateAllTabs();
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        tab.url &&
        tab.url.startsWith("http")
    ) {
        updateTab(tabId);
    }
});

function updateAllTabs() {
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            if (tab.id && tab.url && tab.url.startsWith("http")) {
                updateTab(tab.id);
            }
        }
    });
}

function updateTab(tabId: number) {
    const cursorPath = `images/cursors/${currentCursorTheme}_${currentCursorSize}.png`;
    const cursorUrl = isCursorEnabled
        ? chrome.runtime.getURL(cursorPath)
        : null;

    chrome.tabs
        .sendMessage(tabId, {
            type: "UPDATE_CURSOR",
            isCursorEnabled: isCursorEnabled,
            cursorUrl: cursorUrl,
        })
        .catch((error) => {
            logger.warn(error);
        });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_CURSOR_SETTINGS") {
        const cursorPath = `images/cursors/${currentCursorTheme}_${currentCursorSize}.png`;
        const cursorUrl = isCursorEnabled
            ? chrome.runtime.getURL(cursorPath)
            : null;

        sendResponse({
            isCursorEnabled: isCursorEnabled,
            cursorUrl: cursorUrl,
        });
        return true;
    }
});

function getCurrentCursorUrl() {
    const cursorPath = `images/cursors/${currentCursorTheme}_${currentCursorSize}.png`;
    return chrome.runtime.getURL(cursorPath);
}

function toggleFloatingIframe() {
    const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";
    const existingIframe = document.getElementById(EXTENSION_IFRAME_ID);

    if (existingIframe) {
        existingIframe.remove();
        return;
    }

    const iframe = document.createElement("iframe");
    iframe.id = EXTENSION_IFRAME_ID;
    iframe.src = chrome.runtime.getURL("iframe.html");

    iframe.onerror = function (error) {
        console.error("Failed to load iframe:", error);
    };

    iframe.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        width: 65px;
        height: 65px;
        border: none;
        background: transparent;
        z-index: 2147483647;
    `;
    window.addEventListener("message", (event) => {
        if (event.source !== iframe.contentWindow) {
            return;
        }

        if (event.data.type === "RESIZE_IFRAME") {
            if (event.data.isOpen) {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.style.top = "0";
                iframe.style.right = "0";
            } else {
                iframe.style.width = "65px";
                iframe.style.height = "65px";
                iframe.style.top = "70px";
                iframe.style.right = "20px";
            }
        }
    });
    document.body.appendChild(iframe);
}

function showNotification(tabId: number, message: string) {
    chrome.scripting
        .executeScript({
            target: { tabId: tabId },
            func: (notificationText) => {
                const notification = document.createElement("div");
                notification.textContent = notificationText;
                notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999999;
                font-size: 14px;
            `;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            },
            args: [message],
        })
        .catch((error) => logger.warn("알림 표시 오류:", error));
}

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle_iframe") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: toggleFloatingIframe,
                });
            }
        });
    } else if (command === "toggle-modal") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const tabId = tabs[0]?.id;
                if (tabId !== undefined) {
                    chrome.tabs.sendMessage(tabId, { action: "TOGGLE_MODAL" });
                }
            }
        });
    } else if (command === "toggle-cursor") {
        isCursorEnabled = !isCursorEnabled;

        chrome.storage.sync.set({ isCursorEnabled: isCursorEnabled }, () => {
            chrome.tabs.query({}, (tabs) => {
                for (let tab of tabs) {
                    if (tab.id && tab.url && tab.url.startsWith("http")) {
                        chrome.tabs
                            .sendMessage(tab.id, {
                                action: "TOGGLE_CURSOR",
                            })
                            .catch((error) => {
                                logger.warn(error);
                            });

                        chrome.tabs
                            .sendMessage(tab.id, {
                                type: "UPDATE_CURSOR",
                                isCursorEnabled: isCursorEnabled,
                                cursorUrl: isCursorEnabled
                                    ? getCurrentCursorUrl()
                                    : null,
                            })
                            .catch((error) => {
                                logger.warn(error);
                            });
                    }
                }
            });
        });
    } else if (command === "toggle-all-features") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                const tabId = tabs[0].id;

                if (areStylesEnabled) {
                    chrome.tabs.sendMessage(tabId, {
                        type: "DISABLE_ALL_STYLES",
                    });

                    showNotification(tabId, "모든 스타일이 비활성화되었습니다");

                    areStylesEnabled = false;
                } else {
                    if (savedSettings !== null) {
                        if (savedSettings.userSettings) {
                            if (savedSettings.userSettings.mode) {
                                chrome.tabs.sendMessage(tabId, {
                                    type: savedSettings.userSettings.mode,
                                });
                            }
                        }

                        chrome.tabs.sendMessage(tabId, {
                            type: "UPDATE_CURSOR",
                            isCursorEnabled:
                                savedSettings.isCursorEnabled ?? false,
                            cursorUrl:
                                (savedSettings.isCursorEnabled ?? false)
                                    ? getCurrentCursorUrl()
                                    : null,
                        });

                        chrome.tabs.sendMessage(tabId, {
                            type: "RESTORE_ALL_STYLES",
                            settings: savedSettings,
                        });

                        showNotification(tabId, "모든 스타일이 복원되었습니다");
                    }

                    areStylesEnabled = true;
                }
            }
        });
    }
});
