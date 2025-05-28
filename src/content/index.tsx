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
import React, { useEffect } from "react";

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

const isProductDetailPage = () =>
    window.location.href.includes("coupang.com/vp/products/");

const sendMessageToIframe = (isProductPage: boolean) => {
    // 모든 iframe 요소 검색
    const allIframes = document.querySelectorAll("iframe");
    console.log(
        "[voim] 페이지의 모든 iframe:",
        Array.from(allIframes).map((iframe) => ({
            src: iframe.src,
            id: iframe.id,
            className: iframe.className,
        })),
    );

    // voim 관련 iframe 검색
    const iframe = document.querySelector(
        "#floating-button-extension-iframe",
    ) as HTMLIFrameElement;
    console.log("[voim] iframe 검색 결과:", iframe);
    console.log("[voim] iframe src:", iframe?.src);

    if (iframe) {
        try {
            // postMessage 시도
            iframe.contentWindow?.postMessage(
                {
                    type: "PAGE_TYPE",
                    value: isProductPage,
                },
                "*",
            );
            console.log("[voim] iframe으로 메시지 전송 완료:", isProductPage);
        } catch (error) {
            console.error("[voim] iframe 메시지 전송 실패:", error);

            // 대체 방법: iframe이 로드될 때까지 기다림
            iframe.onload = () => {
                try {
                    iframe.contentWindow?.postMessage(
                        {
                            type: "PAGE_TYPE",
                            value: isProductPage,
                        },
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

// iframe이 DOM에 생길 때까지 기다림
const waitForIframeAndSend = () => {
    console.log("[voim] iframe 감지 시작");

    // 먼저 현재 DOM에서 iframe 검색
    const existingIframe = document.querySelector(
        "#floating-button-extension-iframe",
    );
    if (existingIframe) {
        console.log("[voim] 기존 iframe 발견");
        sendMessageToIframe(isProductDetailPage());
        return;
    }

    const observer = new MutationObserver((mutations) => {
        const iframe = document.querySelector(
            "#floating-button-extension-iframe",
        );
        if (iframe) {
            console.log("[voim] iframe 감지됨");
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

    // 타임아웃: 2초 이내에 iframe이 안 뜨면 포기하고 null 전송
    setTimeout(() => {
        observer.disconnect();
        const iframe = document.querySelector(
            "#floating-button-extension-iframe",
        );
        if (!iframe) {
            console.log("[voim] iframe 못 찾음. null 전송");
            sendMessageToIframe(false);
        }
    }, 2000);
};

// URL 변경 감지를 위한 observer
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

// 메시지 수신 리스너
window.addEventListener("message", (event) => {
    if (event.data.type === "REQUEST_PAGE_TYPE") {
        console.log("[voim] 페이지 타입 요청 수신");
        sendMessageToIframe(isProductDetailPage());
    }
});

if (isProductDetailPage()) {
    console.log("[voim] 쿠팡 상품 상세 페이지 감지됨");
    waitForIframeAndSend();
    urlObserver.observe(document, { subtree: true, childList: true });
}

useEffect(() => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLIFrameElement) {
                    console.log("[voim] iframe 감지됨");
                    const iframe = node as HTMLIFrameElement;
                    console.log(
                        "[voim] 페이지의 모든 iframe:",
                        document.querySelectorAll("iframe"),
                    );
                    console.log("[voim] iframe 검색 결과:", iframe);
                    console.log("[voim] iframe src:", iframe.src);

                    // 백그라운드로 메시지 전송
                    chrome.runtime.sendMessage(
                        {
                            type: "PAGE_TYPE",
                            value: isProductDetailPage(),
                        },
                        (response) => {
                            console.log("[voim] 백그라운드 응답:", response);
                        },
                    );
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return () => observer.disconnect();
}, [isProductDetailPage]);
