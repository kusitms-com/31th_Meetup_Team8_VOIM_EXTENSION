import { FontStyle, UserSettings } from "../types";
import { applyFontStyleToNode } from "../styles/fontStyles";
import { targetSelectors } from "../constants";

/**
 * DOM 변경을 감지하는 MutationObserver를 초기화합니다.
 * @param stylesEnabledCallback 스타일 활성화 상태를 확인하는 콜백
 */
export function initDomObserver(
    stylesEnabledCallback: () => boolean,
): MutationObserver {
    const observer = new MutationObserver((mutations) => {
        // 스토리지에서 직접 활성화 상태 확인
        chrome.storage.sync.get(["stylesEnabled"], (result) => {
            const stylesEnabled =
                result.stylesEnabled !== undefined
                    ? result.stylesEnabled
                    : true;

            if (!stylesEnabled) return;

            chrome.storage.sync.get(["userSettings"], (result) => {
                const settings: UserSettings = result.userSettings || {};

                if (settings.fontSize || settings.fontWeight) {
                    mutations.forEach((mutation) => {
                        // 노드 추가 감지
                        if (mutation.addedNodes.length > 0) {
                            const fontStyle: FontStyle = {};
                            if (settings.fontSize)
                                fontStyle.fontSize = settings.fontSize;
                            if (settings.fontWeight)
                                fontStyle.fontWeight = settings.fontWeight;

                            mutation.addedNodes.forEach((node) => {
                                applyFontStyleToNode(node, fontStyle);
                            });
                        }

                        // 속성 변경 감지 (스타일 덮어쓰기 방지)
                        if (
                            mutation.type === "attributes" &&
                            mutation.attributeName === "style" &&
                            mutation.target.nodeType === Node.ELEMENT_NODE
                        ) {
                            const element = mutation.target as HTMLElement;
                            const targetMatches = targetSelectors.some(
                                (selector) => {
                                    try {
                                        return element.matches(selector);
                                    } catch (e) {
                                        return false;
                                    }
                                },
                            );

                            if (targetMatches) {
                                // 요소가 타겟 선택자와 일치하면 스타일 재적용
                                const fontStyle: FontStyle = {};
                                if (settings.fontSize)
                                    fontStyle.fontSize = settings.fontSize;
                                if (settings.fontWeight)
                                    fontStyle.fontWeight = settings.fontWeight;

                                if (fontStyle.fontSize)
                                    element.style.fontSize = fontStyle.fontSize;
                                if (fontStyle.fontWeight)
                                    element.style.fontWeight =
                                        fontStyle.fontWeight;
                            }
                        }
                    });
                }
            });
        });
    });

    // 요소 추가와 스타일 속성 변경 모두 감지
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
    });

    return observer;
}
