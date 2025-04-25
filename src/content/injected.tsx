import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById(
    "floating-button-extension-container",
);

const extensionId = container?.getAttribute("data-extension-id");

if (container && typeof extensionId === "string") {
    const root = createRoot(container);
    root.render(<App extensionId={extensionId} />);
} else {
    console.error("확장 ID가 없거나 잘못된 형식입니다.");
}
