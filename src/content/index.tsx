import { checkExtensionState } from "./storage/settingsManager";
import { handleStyleMessage } from "./messageHandlers/styleMessageHandler";
import { handleModalMessage } from "./messageHandlers/modalMessageHandler";
import { processImages } from "./imageHandlers/imageProcessor";
import { renderCouponComponent } from "./coupang/renderCouponComponent";
import { initDomObserver } from "./observers/domObserver";
import { detectCategoryType } from "./coupang/categoryHandler/detectCategory";
import { createRoot } from "react-dom/client";
import App from "../iframe/iframe";
import React from "react";

if (window.self !== window.top) {
    const container = document.getElementById("voim-root");
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
        console.log("[voim] iframe 내부에서 App 렌더링");
    }
}

checkExtensionState();

document.addEventListener("DOMContentLoaded", () => {
    checkExtensionState();
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        checkExtensionState();
    }
});

renderCouponComponent();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleStyleMessage(message, sendResponse);
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    return handleModalMessage(message, sendResponse);
});

initDomObserver(() => true);

processImages();

if (location.href.includes("cart.coupang.com/cartView.pang")) {
    window.addEventListener("load", () => {
        setTimeout(() => {}, 500);
    });
}

export const observeAndStoreCategoryType = () => {
    const isCoupangProductPage =
        /^https:\/\/www\.coupang\.com\/vp\/products\/[0-9]+/.test(
            location.href,
        );

    if (!isCoupangProductPage) {
        chrome.storage.local.set({ "voim-category-type": null });
        console.log(
            "[voim] 쿠팡 상세 페이지가 아님. 카테고리를 null로 저장함.",
        );
        return;
    }

    const observer = new MutationObserver(() => {
        const type = detectCategoryType();
        if (type !== null) {
            chrome.storage.local.set({ "voim-category-type": type });
            console.log(`[voim] 감지된 카테고리: ${type}`);
            clearTimeout(timeoutId);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    const timeoutId = setTimeout(() => {
        console.log("[voim] 1.5초 내 감지 실패. null로 저장함.");
        chrome.storage.local.set({ "voim-category-type": null });
        observer.disconnect();
    }, 1500);
};

observeAndStoreCategoryType();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[voim][content] 받은 메시지:", message);

    if (message.type === "GET_VENDOR_HTML") {
        try {
            const vendorEl = document.querySelector(".vendor-item");
            const rawHtml =
                vendorEl?.outerHTML
                    ?.replace(/\sonerror=\"[^\"]*\"/g, "")
                    .replace(/\n/g, "")
                    .trim() ?? "";

            console.log(
                "[voim][content] .vendor-item 추출됨:",
                rawHtml.slice(0, 300),
            );
            sendResponse({ html: rawHtml });
        } catch (e) {
            console.error("[voim][content] vendor 추출 실패:", e);
            sendResponse({ html: "" });
        }

        return true;
    }

    return false;
});

const isProductDetailPage = () =>
    window.location.href.includes("coupang.com/vp/products/");

const sendMessageToIframe = (isProductPage: boolean) => {
    const iframe = document.querySelector(
        "#floating-button-extension-iframe",
    ) as HTMLIFrameElement;

    if (iframe) {
        try {
            iframe.contentWindow?.postMessage(
                { type: "PAGE_TYPE", value: isProductPage },
                "*",
            );
            console.log("[voim] iframe으로 메시지 전송 완료:", isProductPage);
        } catch (error) {
            console.error("[voim] iframe 메시지 전송 실패:", error);
            iframe.onload = () => {
                try {
                    iframe.contentWindow?.postMessage(
                        { type: "PAGE_TYPE", value: isProductPage },
                        "*",
                    );
                    console.log("[voim] iframe onload 후 메시지 전송 완료");
                } catch (error) {
                    console.error(
                        "[voim] iframe onload 후에도 메시지 전송 실패:",
                        error,
                    );
                }
            };
        }
    } else {
        console.log("[voim] iframe을 찾을 수 없음");
    }
};

const waitForIframeAndSend = () => {
    const existingIframe = document.querySelector(
        "#floating-button-extension-iframe",
    );
    if (existingIframe) {
        sendMessageToIframe(isProductDetailPage());
        return;
    }

    const observer = new MutationObserver(() => {
        const iframe = document.querySelector(
            "#floating-button-extension-iframe",
        );
        if (iframe) {
            sendMessageToIframe(isProductDetailPage());
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "id"],
    });

    setTimeout(() => {
        observer.disconnect();
        const iframe = document.querySelector(
            "#floating-button-extension-iframe",
        );
        if (!iframe) {
            sendMessageToIframe(false);
        }
    }, 2000);
};

let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        console.log("[voim] URL 변경 감지:", window.location.href);
        if (isProductDetailPage()) {
            waitForIframeAndSend();
        }
    }
});

window.addEventListener("message", (event) => {
    if (event.data.type === "REQUEST_PAGE_TYPE") {
        sendMessageToIframe(isProductDetailPage());
    }
});

if (isProductDetailPage()) {
    waitForIframeAndSend();
    urlObserver.observe(document, { subtree: true, childList: true });
}
