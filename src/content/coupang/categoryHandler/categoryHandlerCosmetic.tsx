import React from "react";
import { createRoot } from "react-dom/client";
import { CosmeticComponent } from "@src/components/productComponents/cosmeticComponent";

export const observeBreadcrumbCosmeticAndRender = (
    targetElement: HTMLElement,
) => {
    console.log("[voim] Cosmetic 렌더링 함수 호출됨");

    if (!targetElement || targetElement.hasChildNodes()) {
        console.log("[voim] 이미 렌더링됨 또는 target 없음");
        return;
    }

    const root = createRoot(targetElement);
    root.render(<CosmeticComponent />);
    console.log("[voim] CosmeticComponent 사이드바에 렌더링 완료");
};
