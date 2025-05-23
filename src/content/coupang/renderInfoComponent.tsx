import React from "react";
import { createRoot } from "react-dom/client";
import { InfoComponent } from "../../components/productComponents/infoComponent";

export const renderInfoComponent = () => {
    if (!window.location.hostname.includes("coupang.com")) {
        return;
    }

    console.log("[voim] Info 컴포넌트 렌더링 시작");

    if (document.getElementById("voim-info-component")) {
        console.log("[voim] 이미 Info 컴포넌트가 렌더링되어 있음");
        return;
    }

    const container = document.createElement("div");
    container.id = "voim-info-component";
    container.style.position = "absolute";
    container.style.top = "1080px";
    container.style.right = "480px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<InfoComponent />);

    console.log("[voim] Info 컴포넌트 렌더링 완료");
};
