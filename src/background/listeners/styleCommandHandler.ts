import { logger } from "@src/utils/logger";
import { settingsService } from "../services/settingsService";

export async function handleStyleToggle(): Promise<void> {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (tabs[0]?.id) {
        const currentStyleState = await chrome.storage.local.get([
            "stylesEnabled",
        ]);
        const isStylesEnabled = currentStyleState.stylesEnabled ?? true;

        settingsService.setStylesEnabled(isStylesEnabled);

        await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function () {
                const iframeId = "floating-button-extension-iframe";
                const existingIframe = document.getElementById(iframeId);

                if (existingIframe) {
                    existingIframe.remove();
                    chrome.storage.local.set(
                        {
                            iframeInvisible: true,
                            iframeHiddenByAltA: true,
                        },
                        () => {
                            console.log("iframe 숨김 상태로 변경됨 (ALT + A)");
                        },
                    );
                } else {
                    const iframe = document.createElement("iframe");
                    iframe.id = iframeId;
                    iframe.src = chrome.runtime.getURL("iframe.html");
                    iframe.setAttribute("tabindex", "1");

                    iframe.style.position = "fixed";
                    iframe.style.top = "70px";
                    iframe.style.right = "20px";
                    iframe.style.width = "65px";
                    iframe.style.height = "130px";
                    iframe.style.border = "none";
                    iframe.style.background = "transparent";
                    iframe.style.zIndex = "2147483647";

                    iframe.onload = () => {
                        iframe.focus();
                        iframe.contentWindow?.document
                            .getElementById("root")
                            ?.focus();
                    };

                    const handleMessage = function (event: MessageEvent) {
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
                                iframe.style.height = "130px";
                                iframe.style.top = "70px";
                                iframe.style.right = "20px";
                            }
                        }
                    };

                    window.addEventListener("message", handleMessage);
                    document.body.appendChild(iframe);
                    chrome.storage.local.set(
                        {
                            iframeInvisible: false,
                            iframeHiddenByAltA: false,
                        },
                        () => {
                            console.log("iframe 보임 상태로 변경됨");
                        },
                    );
                }
            },
        });

        if (isStylesEnabled) {
            await chrome.tabs.sendMessage(tabs[0].id, {
                type: "DISABLE_ALL_STYLES",
            });
            await chrome.storage.local.set({
                stylesEnabled: false,
            });
            settingsService.setStylesEnabled(false);
        } else {
            await chrome.tabs.sendMessage(tabs[0].id, {
                type: "RESTORE_ALL_STYLES",
            });
            await chrome.storage.local.set({
                stylesEnabled: true,
            });
            settingsService.setStylesEnabled(true);
        }
    }
}
