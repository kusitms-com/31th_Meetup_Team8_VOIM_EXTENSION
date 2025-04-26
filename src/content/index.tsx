const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";

if (!document.getElementById(EXTENSION_IFRAME_ID)) {
    const iframe = document.createElement("iframe");
    iframe.id = EXTENSION_IFRAME_ID;
    iframe.src = chrome.runtime.getURL("iframe.html");

    iframe.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: auto;
        height: auto;
        border: none;
        background: transparent;
    `;
    window.addEventListener("message", (event) => {
        if (event.data.type === "RESIZE_IFRAME") {
            if (event.data.isOpen) {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
            } else {
                iframe.style.width = "auto";
                iframe.style.height = "auto";
            }
        }
    });
    document.body.appendChild(iframe);
}
