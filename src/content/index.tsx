const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";

if (!document.getElementById(EXTENSION_IFRAME_ID)) {
    const iframe = document.createElement("iframe");
    iframe.id = EXTENSION_IFRAME_ID;
    iframe.src = chrome.runtime.getURL("iframe.html");

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
