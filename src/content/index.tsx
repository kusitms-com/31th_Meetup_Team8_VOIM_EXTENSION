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

export const observeAndStoreCategoryType = () => {
    const isCoupangProductPage =
        /^https:\/\/www\.coupang\.com\/vp\/products\/[0-9]+/.test(
            location.href,
        );

    if (!isCoupangProductPage) {
        chrome.storage.local.set({ "voim-category-type": null });
        return;
    }

    const observer = new MutationObserver(() => {
        const type = detectCategoryType();
        if (type !== null) {
            chrome.storage.local.set({ "voim-category-type": type });
            clearTimeout(timeoutId);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    const timeoutId = setTimeout(() => {
        chrome.storage.local.set({ "voim-category-type": null });
        observer.disconnect();
    }, 1500);
};

observeAndStoreCategoryType();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_VENDOR_HTML") {
        try {
            const vendorEl = document.querySelector(".vendor-item");
            const rawHtml =
                vendorEl?.outerHTML
                    ?.replace(/\sonerror=\"[^\"]*\"/g, "")
                    .replace(/\n/g, "")
                    .trim() ?? "";

            sendResponse({ html: rawHtml });
        } catch (e) {
            sendResponse({ html: "" });
        }

        return true;
    }

    return false;
});

const isProductDetailPage = () => {
    return window.location.href.includes("/products/");
};

const isCartPage = () => {
    return window.location.href.includes("cart.coupang.com/cartView.pang");
};

const sendMessageToIframe = (isProductPage: boolean, isCart: boolean) => {
    const iframe = document.querySelector(
        "#floating-button-extension-iframe",
    ) as HTMLIFrameElement;

    if (iframe) {
        try {
            iframe.contentWindow?.postMessage(
                { type: "PAGE_TYPE", value: isProductPage },
                "*",
            );
            iframe.contentWindow?.postMessage(
                { type: "CART_PAGE", value: isCart },
                "*",
            );
        } catch (error) {
            iframe.onload = () => {
                try {
                    iframe.contentWindow?.postMessage(
                        { type: "PAGE_TYPE", value: isProductPage },
                        "*",
                    );
                    iframe.contentWindow?.postMessage(
                        { type: "CART_PAGE", value: isCart },
                        "*",
                    );
                } catch (error) {}
            };
        }
    }
};

const waitForIframeAndSend = () => {
    setTimeout(() => {
        sendMessageToIframe(isProductDetailPage(), isCartPage());
    }, 500);
};

let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        if (isProductDetailPage() || isCartPage()) {
            waitForIframeAndSend();
        }
    }
});

window.addEventListener("message", (event) => {
    if (event.data.type === "REQUEST_PAGE_TYPE") {
        sendMessageToIframe(isProductDetailPage(), isCartPage());
    }
});

if (isProductDetailPage() || isCartPage()) {
    waitForIframeAndSend();
    urlObserver.observe(document, { subtree: true, childList: true });
}
