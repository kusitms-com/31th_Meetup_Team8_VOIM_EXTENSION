import React from "react";
import { createRoot } from "react-dom/client";
import { FoodComponent } from "../../../components/productComponents/foodComponent";

export const observeBreadcrumbFoodAndRender = (targetElement: HTMLElement) => {
    const breadcrumbEl = document.querySelector(".breadcrumb, #breadcrumb");
    const rawText = breadcrumbEl?.textContent || "";
    const cleanedText = rawText.replace(/\s+/g, "");

    const containsOnlyFood =
        cleanedText.includes("식품") && !cleanedText.includes("건강식품");

    if (!containsOnlyFood) {
        return;
    }

    if (!targetElement) return;
    if (targetElement.hasChildNodes()) return;

    const root = createRoot(targetElement);
    root.render(<FoodComponent />);
};
