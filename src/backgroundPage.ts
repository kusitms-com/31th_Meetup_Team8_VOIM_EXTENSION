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
