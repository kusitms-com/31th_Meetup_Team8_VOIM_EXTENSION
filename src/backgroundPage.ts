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
