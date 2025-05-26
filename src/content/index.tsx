import { checkExtensionState } from "./storage/settingsManager";
import { handleStyleMessage } from "./messageHandlers/styleMessageHandler";
import { handleModalMessage } from "./messageHandlers/modalMessageHandler";
import { processImages } from "./imageHandlers/imageProcessor";
// import { checkCategoryCosmeticAndRender } from "./coupang/categoryHandler/categoryHandlerCosmetic";
// import { checkCategoryFoodAndRender } from "./coupang/categoryHandler/categoryHandlerFood";
// import { checkCategoryHealthAndRender } from "./coupang/categoryHandler/categoryHandlerHealth";
import { renderCouponComponent } from "./coupang/renderCouponComponent";
import { renderInfoComponent } from "../content/coupang/renderInfoComponent";
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
renderInfoComponent();
checkExtensionState();

document.addEventListener("DOMContentLoaded", () => {
    checkExtensionState();
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        checkExtensionState();
    }
});

// window.addEventListener("load", () => {
//     setTimeout(() => {
//         renderCouponComponent();
//     }, 1500);
// });
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
    const observer = new MutationObserver(() => {
        const type = detectCategoryType();
        if (type) {
            chrome.storage.local.set({ "voim-category-type": type });
            console.log(`[voim] 감지된 카테고리: ${type}`);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log("[voim] 카테고리 감지 대기 중...");
};
observeAndStoreCategoryType();
