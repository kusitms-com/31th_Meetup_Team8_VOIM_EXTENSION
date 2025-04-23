console.log("Content script 실행됨");

const EXTENSION_CONTAINER_ID = "floating-button-extension-container";

if (!document.getElementById(EXTENSION_CONTAINER_ID)) {
    console.log("컨테이너 생성 시작");

    const container = document.createElement("div");
    container.id = EXTENSION_CONTAINER_ID;
    document.body.appendChild(container);
    console.log("컨테이너 생성 완료:", container);

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("js/injected.js");
    console.log("주입할 스크립트 URL:", script.src);

    script.onload = function () {
        console.log("스크립트 로드 완료");
        script.remove();

        // ✅ chrome.storage.local에 확장 프로그램 ID 저장
        const extensionId = chrome.runtime.id;
        chrome.storage.local.set({ extensionId }, () => {
            console.log("확장 프로그램 ID 저장됨:", extensionId);
        });
    };

    (document.head || document.documentElement).appendChild(script);
    console.log("스크립트 주입 완료");
}
