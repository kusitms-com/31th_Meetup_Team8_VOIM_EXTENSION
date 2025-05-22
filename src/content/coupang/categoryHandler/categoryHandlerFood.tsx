import React from "react";
import { createRoot } from "react-dom/client";
import { FoodComponent } from "../../../components/productComponents/foodComponent";

export const observeBreadcrumbFoodAndRender = () => {
    const observer = new MutationObserver(() => {
        const breadcrumbEl = document.querySelector("#breadcrumb");
        if (breadcrumbEl) {
            observer.disconnect();
            checkCategoryFoodAndRender();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

export const checkCategoryFoodAndRender = () => {
    const breadcrumbEl = document.querySelector("#breadcrumb");
    if (!breadcrumbEl) {
        return;
    }

    const rawText = breadcrumbEl.textContent || "";
    const cleanedText = rawText.replace(/\s+/g, "");

    const isFoodCategory = cleanedText.includes("식품");
    if (!isFoodCategory) {
        return;
    }

    if (document.getElementById("voim-food-component")) {
        return;
    }

    const container = document.createElement("div");
    container.id = "voim-food-component";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<FoodComponent />);
};
