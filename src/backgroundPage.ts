import browser from "webextension-polyfill";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
    // Log statement if request.popupMounted is true
    // NOTE: this request is sent in `popup/component.tsx`
    if (request.popupMounted) {
        console.log("backgroundPage notified that Popup.tsx has mounted.");
    }
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("익스텐션이 설치되었습니다.");
});

// 메시지 리스너 (필요한 경우)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SOME_EVENT") {
        // 메시지 처리 로직
        sendResponse({ success: true });
    }
    return true; // 비동기 응답을 위해 true 반환
});
