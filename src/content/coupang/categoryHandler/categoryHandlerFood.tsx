import React from "react";
import { createRoot } from "react-dom/client";
import { FoodComponent } from "../../../components/productComponents/foodComponent";

export const observeBreadcrumbFoodAndRender = (targetElement: HTMLElement) => {
    console.log("[voim] 렌더링 함수 호출됨");
    const breadcrumbEl = document.querySelector(".breadcrumb, #breadcrumb");
    const rawText = breadcrumbEl?.textContent || "";
    const cleanedText = rawText.replace(/\s+/g, "");

    const containsOnlyFood =
        cleanedText.includes("식품") && !cleanedText.includes("건강식품");

    if (!containsOnlyFood) {
        console.log("[voim] 식품 단독 카테고리가 아님");
        return;
    }

    if (!targetElement) return;
    if (targetElement.hasChildNodes()) return;

    const root = createRoot(targetElement);
    root.render(<FoodComponent />);
    console.log("[voim] FoodComponent 사이드바에 렌더링 완료");
};
