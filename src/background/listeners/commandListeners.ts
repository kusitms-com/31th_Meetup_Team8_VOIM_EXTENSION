import { logger } from "@src/utils/logger";
import { cursorService } from "../services/cursorService";
import { iframeService } from "../services/iframeService";
import { settingsService } from "../services/settingsService";

/**
 * 명령어 리스너 초기화
 */
export function initCommandListeners(): void {
    chrome.commands.onCommand.addListener(async (command) => {
        logger.debug(`명령어 수신: ${command}`);

        try {
            if (command === "toggle_iframe") {
                logger.debug("toggle_iframe 명령어 처리 중");
                try {
                    const tabs = await chrome.tabs.query({
                        active: true,
                        currentWindow: true,
                    });
                    if (tabs[0]?.id) {
                        await chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            func: function () {
                                try {
                                    console.log("iframe 토글 직접 실행");
                                    const iframeId =
                                        "floating-button-extension-iframe";
                                    const existingIframe =
                                        document.getElementById(iframeId);

                                    // 현재 iframeInvisible 상태 확인
                                    chrome.storage.local.get(
                                        [
                                            "iframeInvisible",
                                            "iframeHiddenByAltA",
                                        ],
                                        (result) => {
                                            const isInvisible =
                                                result.iframeInvisible ?? false;

                                            if (existingIframe) {
                                                // iframe이 있으면 제거하고 상태를 true로 설정
                                                existingIframe.remove();
                                                chrome.storage.local.set(
                                                    {
                                                        iframeInvisible: true,
                                                        iframeHiddenByAltA:
                                                            false,
                                                    },
                                                    () => {
                                                        console.log(
                                                            "iframe 숨김 상태로 변경됨 (ALT + V)",
                                                        );
                                                    },
                                                );
                                            } else {
                                                // iframe이 없으면 생성하고 상태를 false로 설정
                                                const iframe =
                                                    document.createElement(
                                                        "iframe",
                                                    );
                                                iframe.id = iframeId;
                                                iframe.src =
                                                    chrome.runtime.getURL(
                                                        "iframe.html",
                                                    );

                                                iframe.style.position = "fixed";
                                                iframe.style.top = "70px";
                                                iframe.style.right = "20px";
                                                iframe.style.width = "65px";
                                                iframe.style.height = "65px";
                                                iframe.style.border = "none";
                                                iframe.style.background =
                                                    "transparent";
                                                iframe.style.zIndex =
                                                    "2147483647";

                                                const handleMessage = function (
                                                    event: MessageEvent,
                                                ) {
                                                    if (
                                                        event.source !==
                                                        iframe.contentWindow
                                                    ) {
                                                        return;
                                                    }

                                                    if (
                                                        event.data.type ===
                                                        "RESIZE_IFRAME"
                                                    ) {
                                                        if (event.data.isOpen) {
                                                            iframe.style.width =
                                                                "100%";
                                                            iframe.style.height =
                                                                "100%";
                                                            iframe.style.top =
                                                                "0";
                                                            iframe.style.right =
                                                                "0";
                                                        } else {
                                                            iframe.style.width =
                                                                "65px";
                                                            iframe.style.height =
                                                                "65px";
                                                            iframe.style.top =
                                                                "70px";
                                                            iframe.style.right =
                                                                "20px";
                                                        }
                                                    }
                                                };

                                                window.addEventListener(
                                                    "message",
                                                    handleMessage,
                                                );
                                                document.body.appendChild(
                                                    iframe,
                                                );
                                                chrome.storage.local.set(
                                                    {
                                                        iframeInvisible: false,
                                                        iframeHiddenByAltA:
                                                            false,
                                                    },
                                                    () => {
                                                        console.log(
                                                            "iframe 보임 상태로 변경됨",
                                                        );
                                                    },
                                                );
                                            }
                                        },
                                    );
                                } catch (err) {
                                    console.error("iframe 토글 오류:", err);
                                }
                            },
                        });
                        logger.debug("iframe 토글 스크립트 실행 완료");
                    }
                } catch (error) {
                    logger.error("직접 스크립트 실행 중 오류:", error);
                    await iframeService.toggleIframeInActiveTab();
                }
            } else if (command === "toggle-modal") {
                const tabs = await chrome.tabs.query({
                    active: true,
                    currentWindow: true,
                });
                if (tabs[0]?.id) {
                    await chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: function () {
                            const iframeId = "floating-button-extension-iframe";
                            let iframe = document.getElementById(
                                iframeId,
                            ) as HTMLIFrameElement;

                            if (!iframe) {
                                // iframeInvisible 상태 확인
                                chrome.storage.local.get(
                                    [
                                        "iframeInvisible",
                                        "iframeHiddenByAltA",
                                        "iframeHiddenByAltV",
                                    ],
                                    (result) => {
                                        const isInvisible =
                                            result.iframeInvisible ?? false;
                                        const hiddenByAltA =
                                            result.iframeHiddenByAltA ?? false;
                                        const hiddenByAltV =
                                            result.iframeHiddenByAltV ?? false;

                                        // ALT+A로 숨긴 경우에는 아무 동작 안 함
                                        if (hiddenByAltA) {
                                            console.log(
                                                "ALT + A로 숨겨져 있어서 동작하지 않음",
                                            );
                                            return;
                                        }

                                        // ALT+V로 숨긴 경우에만 iframe 생성하고 모달 띄우기
                                        if (isInvisible) {
                                            iframe =
                                                document.createElement(
                                                    "iframe",
                                                );
                                            iframe.id = iframeId;
                                            iframe.src =
                                                chrome.runtime.getURL(
                                                    "iframe.html",
                                                );

                                            iframe.style.position = "fixed";
                                            iframe.style.top = "70px";
                                            iframe.style.right = "20px";
                                            iframe.style.width = "65px";
                                            iframe.style.height = "65px";
                                            iframe.style.border = "none";
                                            iframe.style.background =
                                                "transparent";
                                            iframe.style.zIndex = "2147483647";

                                            const handleMessage = function (
                                                event: MessageEvent,
                                            ) {
                                                if (
                                                    event.source !==
                                                    iframe.contentWindow
                                                ) {
                                                    return;
                                                }
                                                if (
                                                    event.data.type ===
                                                    "RESIZE_IFRAME"
                                                ) {
                                                    if (event.data.isOpen) {
                                                        iframe.style.width =
                                                            "100%";
                                                        iframe.style.height =
                                                            "100%";
                                                        iframe.style.top = "0";
                                                        iframe.style.right =
                                                            "0";
                                                    } else {
                                                        iframe.style.width =
                                                            "65px";
                                                        iframe.style.height =
                                                            "65px";
                                                        iframe.style.top =
                                                            "70px";
                                                        iframe.style.right =
                                                            "20px";
                                                    }
                                                }
                                            };
                                            window.addEventListener(
                                                "message",
                                                handleMessage,
                                            );
                                            document.body.appendChild(iframe);
                                            chrome.storage.local.set(
                                                {
                                                    iframeInvisible: false,
                                                    iframeHiddenByAltA: false,
                                                    iframeHiddenByAltV: true,
                                                },
                                                () => {
                                                    console.log(
                                                        "iframe 보임 상태로 변경됨 (ALT + O)",
                                                    );
                                                },
                                            );
                                            iframe.onload = function () {
                                                if (iframe.contentWindow) {
                                                    iframe.contentWindow.postMessage(
                                                        {
                                                            type: "TOGGLE_MODAL",
                                                        },
                                                        "*",
                                                    );
                                                }
                                            };
                                        }
                                    },
                                );
                            } else {
                                // iframe이 있으면 모달 토글
                                if (iframe.contentWindow) {
                                    // 현재 모달 상태 확인을 위해 메시지 전송
                                    iframe.contentWindow.postMessage(
                                        { type: "TOGGLE_MODAL" },
                                        "*",
                                    );

                                    // ALT+V로 숨겼던 경우에만 모달 닫을 때 iframe도 제거
                                    chrome.storage.local.get(
                                        ["iframeHiddenByAltV"],
                                        (result) => {
                                            const hiddenByAltV =
                                                result.iframeHiddenByAltV ??
                                                false;

                                            // ALT+V로 숨겼던 경우에만 iframe 제거
                                            if (hiddenByAltV) {
                                                iframe.remove();
                                                chrome.storage.local.set(
                                                    {
                                                        iframeInvisible: true,
                                                        iframeHiddenByAltA:
                                                            false,
                                                        iframeHiddenByAltV:
                                                            false,
                                                    },
                                                    () => {
                                                        console.log(
                                                            "iframe 숨김 상태로 변경됨 (ALT + O)",
                                                        );
                                                    },
                                                );
                                            }
                                        },
                                    );
                                }
                            }
                        },
                    });
                }
            } else if (command === "toggle-all-features") {
                const tabs = await chrome.tabs.query({
                    active: true,
                    currentWindow: true,
                });

                if (tabs[0]?.id) {
                    await chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: function () {
                            const iframeId = "floating-button-extension-iframe";
                            const existingIframe =
                                document.getElementById(iframeId);

                            if (existingIframe) {
                                // iframe이 있으면 제거
                                existingIframe.remove();
                                chrome.storage.local.set(
                                    {
                                        iframeInvisible: true,
                                        iframeHiddenByAltA: true,
                                    },
                                    () => {
                                        console.log(
                                            "iframe 숨김 상태로 변경됨 (ALT + A)",
                                        );
                                    },
                                );
                            } else {
                                // iframe이 없으면 생성
                                const iframe = document.createElement("iframe");
                                iframe.id = iframeId;
                                iframe.src =
                                    chrome.runtime.getURL("iframe.html");

                                iframe.style.position = "fixed";
                                iframe.style.top = "70px";
                                iframe.style.right = "20px";
                                iframe.style.width = "65px";
                                iframe.style.height = "65px";
                                iframe.style.border = "none";
                                iframe.style.background = "transparent";
                                iframe.style.zIndex = "2147483647";

                                const handleMessage = function (
                                    event: MessageEvent,
                                ) {
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
                                };

                                window.addEventListener(
                                    "message",
                                    handleMessage,
                                );
                                document.body.appendChild(iframe);
                                chrome.storage.local.set(
                                    {
                                        iframeInvisible: false,
                                        iframeHiddenByAltA: false,
                                    },
                                    () => {
                                        console.log(
                                            "iframe 보임 상태로 변경됨",
                                        );
                                    },
                                );
                            }
                        },
                    });
                }
            }
        } catch (error) {
            logger.error(`명령어 처리 중 오류 (${command}):`, error);
        }
    });
}
