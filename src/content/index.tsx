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

(() => {
    let contentCursorEnabled = true;

    chrome.runtime.sendMessage({ type: "GET_CURSOR_SETTINGS" }, (response) => {
        if (response) {
            contentCursorEnabled = response.isCursorEnabled;

            if (contentCursorEnabled && response.cursorUrl) {
                applyCursorStyle(response.cursorUrl);
            } else {
                removeCursorStyle();
            }
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "UPDATE_CURSOR") {
            if (message.isCursorEnabled && message.cursorUrl) {
                applyCursorStyle(message.cursorUrl);
                contentCursorEnabled = true;
            } else {
                removeCursorStyle();
                contentCursorEnabled = false;
            }

            sendResponse({ success: true });
            return true;
        }
        return false;
    });

    function applyCursorStyle(cursorUrl: string) {
        try {
            const existingStyle = document.getElementById(
                "custom-cursor-style",
            );
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }

            const styleElement = document.createElement("style");
            styleElement.id = "custom-cursor-style";
            styleElement.textContent = `
                body, button, a, input, select, textarea {
                    cursor: url('${cursorUrl}'), auto !important;
                }
            `;
            document.head.appendChild(styleElement);

            applyStyleToIframes(styleElement.textContent);
        } catch (error) {
            console.error("커서 스타일 적용 중 오류:", error);
        }
    }

    function removeCursorStyle() {
        const existingStyle = document.getElementById("custom-cursor-style");
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }

        removeStyleFromIframes();
    }

    function applyStyleToIframes(styleContent: string) {
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
            try {
                const iframeDoc =
                    iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    const existingIframeStyle = iframeDoc.getElementById(
                        "custom-cursor-style",
                    );
                    if (existingIframeStyle) {
                        iframeDoc.head.removeChild(existingIframeStyle);
                    }
                    const iframeStyle = iframeDoc.createElement("style");
                    iframeStyle.id = "custom-cursor-style";
                    iframeStyle.textContent = styleContent;
                    iframeDoc.head.appendChild(iframeStyle);
                }
            } catch (e) {
                e;
            }
        });
    }

    function removeStyleFromIframes() {
        const iframes = document.querySelectorAll("iframe");

        iframes.forEach((iframe) => {
            try {
                const iframeDoc = iframe.contentDocument;

                if (iframeDoc) {
                    const existingIframeStyle = iframeDoc.getElementById(
                        "custom-cursor-style",
                    );
                    if (existingIframeStyle) {
                        iframeDoc.head.removeChild(existingIframeStyle);
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        });
    }
})();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TOGGLE_MODAL") {
        const iframe = document.getElementById(
            "floating-button-extension-iframe",
        );
        if (iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: "TOGGLE_MODAL" }, "*");
        }
        sendResponse({ success: true });
        return true;
    } else if (message.action === "TOGGLE_CURSOR") {
        const iframe = document.getElementById(
            "floating-button-extension-iframe",
        );
        if (iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: "TOGGLE_CURSOR" }, "*");
        }
        sendResponse({ success: true });
        return true;
    }

    return false;
});
