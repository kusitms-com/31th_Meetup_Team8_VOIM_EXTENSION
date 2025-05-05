chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SOME_EVENT") {
        sendResponse({ success: true });
    }
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    }
    return true;
});

let currentCursorTheme = "white";
let currentCursorSize = "medium";

chrome.storage.sync.get(["cursorTheme", "cursorSize"], (result) => {
    if (result.cursorTheme) {
        currentCursorTheme = result.cursorTheme;
    }
    if (result.cursorSize) {
        currentCursorSize = result.cursorSize;
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync") {
        if (changes.cursorTheme) {
            currentCursorTheme = changes.cursorTheme.newValue;
            updateAllTabs();
        }
        if (changes.cursorSize) {
            currentCursorSize = changes.cursorSize.newValue;
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
    const cursorUrl = chrome.runtime.getURL(cursorPath);

    chrome.tabs
        .sendMessage(tabId, {
            type: "UPDATE_CURSOR",
            cursorUrl: cursorUrl,
        })
        .catch((error) => {
            console.log(`탭 ${tabId} 통신 오류:`, error);
        });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_CURSOR_SETTINGS") {
        const cursorPath = `images/cursors/${currentCursorTheme}_${currentCursorSize}.png`;
        const cursorUrl = chrome.runtime.getURL(cursorPath);

        sendResponse({
            cursorUrl: cursorUrl,
        });
        return true;
    }
});

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
    }
});

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
