import { checkExtensionState } from "./storage/settingsManager";
import { handleStyleMessage } from "./messageHandlers/styleMessageHandler";
import { handleModalMessage } from "./messageHandlers/modalMessageHandler";
import { processImages } from "./imageHandlers/imageProcessor";
// import { checkCategoryCosmeticAndRender } from "./coupang/categoryHandler/categoryHandlerCosmetic";
// import { checkCategoryFoodAndRender } from "./coupang/categoryHandler/categoryHandlerFood";
// import { checkCategoryHealthAndRender } from "./coupang/categoryHandler/categoryHandlerHealth";
import { renderCouponComponent } from "./coupang/renderCouponComponent";
// import { renderInfoComponent } from "../content/coupang/renderInfoComponent";
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

initDomObserver(() => {
    return true;
});

processImages();

if (location.href.includes("cart.coupang.com/cartView.pang")) {
    window.addEventListener("load", () => {
        setTimeout(() => {}, 500);
    });
}

// if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", () => {
//         checkCategoryFoodAndRender();
//     });
// } else {
//     checkCategoryFoodAndRender();
// }
// if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", () => {
//         checkCategoryCosmeticAndRender();
//     });
// } else {
//     checkCategoryCosmeticAndRender();
// }
// if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", () => {
//         checkCategoryHealthAndRender();
//     });
// } else {
//     checkCategoryHealthAndRender();
// }
export const observeAndStoreCategoryType = () => {
    const isCoupangProductPage =
        /^https:\/\/www\.coupang\.com\/vp\/products\/\d+/.test(location.href);

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
            clearTimeout(timeoutId); // 타이머 정리
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

// 실행
observeAndStoreCategoryType();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[voim][content] 받은 메시지:", message);

    if (message.type === "GET_VENDOR_HTML") {
        let rawHtml = "";

        try {
            const vendorEl = document.querySelector(".vendor-item");
            rawHtml =
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
            sendResponse({ html: rawHtml });
        }

        return true;
    }

    return false;
});
