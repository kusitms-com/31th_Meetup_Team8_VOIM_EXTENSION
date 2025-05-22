import React from "react";
import { createRoot } from "react-dom/client";
import { FoodComponent } from "../../components/productComponents/foodComponent";

export const observeBreadcrumbAndRender = () => {
    const observer = new MutationObserver(() => {
        const breadcrumbEl = document.querySelector("#breadcrumb");
        if (breadcrumbEl) {
            console.log("[voim] #breadcrumb 발견됨 ");
            observer.disconnect();
            checkCategoryAndRender();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log("[voim] breadcrumb 감지 대기 중...");
};

export const checkCategoryAndRender = () => {
    const breadcrumbEl = document.querySelector("#breadcrumb");
    if (!breadcrumbEl) {
        console.log("#breadcrumb 엘리먼트를 찾을 수 없음 ");
        return;
    }

    const rawText = breadcrumbEl.textContent || "";
    const cleanedText = rawText.replace(/\s+/g, "");
    console.log("[voim] breadcrumb 내용:", cleanedText);

    const isFoodCategory = cleanedText.includes("식품");
    if (!isFoodCategory) {
        console.log("[voim] 식품 카테고리가 아님");
        return;
    }

    if (document.getElementById("voim-food-component")) {
        console.log("[voim] 이미 컴포넌트 렌더링됨");
        return;
    }

    const container = document.createElement("div");
    container.id = "voim-food-component";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<FoodComponent />);
    console.log("[voim] FoodComponent 렌더링 완료 ");
};
