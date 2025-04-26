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

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RESET_SETTINGS") {
        // alert 창 띄우기 (현재 활성화된 탭에 띄움)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                // id가 존재하는지 확인
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        alert("설정이 초기화되었습니다.");
                    },
                });
            }
        });

        // 설정 초기화 로직 추가
        // 예: chrome.storage.local.clear();

        // 응답 전송
        sendResponse({ success: true });
    }
    return true; // 비동기 응답을 위해 필요
});
