import React from "react";
import { createRoot } from "react-dom/client";
import { CosmeticComponent } from "@src/components/productComponents/cosmeticComponent";

export const observeBreadcrumbCosmeticAndRender = (
    targetElement: HTMLElement,
) => {
    if (!targetElement || targetElement.hasChildNodes()) {
        return;
    }

    const root = createRoot(targetElement);
    root.render(<CosmeticComponent />);
};
