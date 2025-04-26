// content.ts
const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";

if (!document.getElementById(EXTENSION_IFRAME_ID)) {
    console.log("iframe 생성 시작");

    const iframe = document.createElement("iframe");
    iframe.id = EXTENSION_IFRAME_ID;
    iframe.src = chrome.runtime.getURL("iframe.html");

    // iframe 스타일 설정
    iframe.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border: none;
        z-index: 999999;
        background: transparent;
    `;

    document.body.appendChild(iframe);
    console.log("iframe 생성 완료:", iframe);
}
