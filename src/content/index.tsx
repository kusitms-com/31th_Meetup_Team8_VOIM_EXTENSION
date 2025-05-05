const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";

if (!document.getElementById(EXTENSION_IFRAME_ID)) {
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

// content-script.js
(() => {
    // 페이지 로드 시 최신 커서 설정 가져오기
    chrome.runtime.sendMessage({ type: "GET_CURSOR_SETTINGS" }, (response) => {
        if (response && response.cursorUrl) {
            applyCursorStyle(response.cursorUrl);
            console.log(response.cursorUrl);
        }
    });

    // 확장 프로그램에서 메시지 수신
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "UPDATE_CURSOR") {
            applyCursorStyle(message.cursorUrl);
            console.log(message.cursorUrl);
            sendResponse({ success: true });
        }
    });

    // 커서 스타일 적용
    function applyCursorStyle(cursorUrl: string) {
        console.log(cursorUrl);
        try {
            // 기존 스타일 요소가 있으면 제거
            const existingStyle = document.getElementById(
                "custom-cursor-style",
            );
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }

            // 새 스타일 요소 생성 및 추가
            const styleElement = document.createElement("style");
            styleElement.id = "custom-cursor-style";
            styleElement.textContent = `
          * {
            cursor: url('${cursorUrl}'), auto !important;
          }
        `;
            document.head.appendChild(styleElement);
        } catch (error) {
            console.error("커서 스타일 적용 중 오류:", error);
        }
    }
})();
