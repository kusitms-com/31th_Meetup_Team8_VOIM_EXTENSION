// 중복 선언된 상수를 하나로 통합
const EXTENSION_IFRAME_ID = "floating-button-extension-iframe";

// 인터페이스 정의
interface ModeStyle {
    backgroundColor: string;
    color: string;
}

interface FontStyle {
    fontSize?: string;
    fontWeight?: string;
}

// 타입 정의로 타입 안전성 확보
type FontSizeType =
    | "SET_FONT_SIZE_XS"
    | "SET_FONT_SIZE_S"
    | "SET_FONT_SIZE_M"
    | "SET_FONT_SIZE_L"
    | "SET_FONT_SIZE_XL";
type FontWeightType =
    | "SET_FONT_WEIGHT_REGULAR"
    | "SET_FONT_WEIGHT_BOLD"
    | "SET_FONT_WEIGHT_XBOLD";
type ModeType = "SET_MODE_LIGHT" | "SET_MODE_DARK";
type MessageType = FontSizeType | FontWeightType | ModeType;

// 타입 안전한 맵 정의
const fontSizeMap: Record<FontSizeType, string> = {
    SET_FONT_SIZE_XS: "20px",
    SET_FONT_SIZE_S: "22px",
    SET_FONT_SIZE_M: "24px",
    SET_FONT_SIZE_L: "26px",
    SET_FONT_SIZE_XL: "28px",
};

const fontWeightMap: Record<FontWeightType, string> = {
    SET_FONT_WEIGHT_REGULAR: "400",
    SET_FONT_WEIGHT_BOLD: "700",
    SET_FONT_WEIGHT_XBOLD: "800",
};

const modeStyleMap: Record<ModeType, ModeStyle> = {
    SET_MODE_LIGHT: {
        backgroundColor: "#fefefe",
        color: "#121212",
    },
    SET_MODE_DARK: {
        backgroundColor: "#121212",
        color: "#fefefe",
    },
};

const targetSelectors = [
    "h1",
    "h2",
    "p",
    "li",
    "h5",
    "ul",
    ".name",
    "em",
    "span",
    ".prod-buy-header__title",
    ".prod-description",
    ".prod-spec",
    ".delivery-info",
    "div",
];

// iframe 생성 함수
function createIframe(): void {
    if (!document.getElementById(EXTENSION_IFRAME_ID)) {
        const iframe = document.createElement("iframe");
        iframe.id = EXTENSION_IFRAME_ID;
        iframe.src = chrome.runtime.getURL("iframe.html");

        iframe.onerror = function (error: Event | string) {
            console.error("Failed to load iframe:", error);
        };

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

        window.addEventListener("message", (event: MessageEvent) => {
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
}

// 스타일 적용 함수들
function applyFontStyle(style: FontStyle): void {
    const elements = document.querySelectorAll(targetSelectors.join(","));
    elements.forEach((el) => {
        // Element 타입에 style 속성이 없으므로 HTMLElement로 타입 단언
        const htmlEl = el as HTMLElement;
        if (style.fontSize) htmlEl.style.fontSize = style.fontSize;
        if (style.fontWeight) htmlEl.style.fontWeight = style.fontWeight;
    });
}

function applyModeStyle(modeType: ModeType): void {
    const mode = modeStyleMap[modeType];
    if (!mode) return;

    const { backgroundColor, color } = mode;

    const oldStyle = document.getElementById("webeye-mode-style");
    if (oldStyle) oldStyle.remove();

    const style = document.createElement("style");
    style.id = "webeye-mode-style";
    style.textContent = `
        * {
            color: ${color} !important;
            background-color: transparent !important;
        }

        html, body {
            background-color: ${backgroundColor} !important;
            color: ${color} !important;
        }

        a, span, div, p, h1, h2, h3, h4, h5, h6, li, ul, em, strong, td, th, button {
            color: ${color} !important;
            background-color: transparent !important;
            border-color: ${color} !important;
        }

        input, textarea, select {
            background-color: ${backgroundColor} !important;
            color: ${color} !important;
            border: 1px solid ${color} !important;
        }

        img, video {
            filter: brightness(0.8) contrast(1.2);
        }
    `;
    document.head.appendChild(style);
}

// 메시지 리스너
chrome.runtime.onMessage.addListener(
    (message: { type: MessageType }, sender, sendResponse) => {
        const { type } = message;

        if (Object.keys(fontSizeMap).includes(type as string)) {
            // 타입 안전성을 위한 타입 가드
            const fontSizeType = type as FontSizeType;
            applyFontStyle({ fontSize: fontSizeMap[fontSizeType] });
            sendResponse({ success: true });
        } else if (Object.keys(fontWeightMap).includes(type as string)) {
            const fontWeightType = type as FontWeightType;
            applyFontStyle({ fontWeight: fontWeightMap[fontWeightType] });
            sendResponse({ success: true });
        } else if (Object.keys(modeStyleMap).includes(type as string)) {
            const modeType = type as ModeType;
            applyModeStyle(modeType);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: "알 수 없는 메시지" });
        }

        return true;
    },
);

// 초기화 - iframe 생성 실행
createIframe();
