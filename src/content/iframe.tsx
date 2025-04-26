// react-app.tsx (이전의 injected.tsx)
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// iframe 내부에서는 chrome API 직접 접근 가능
const container = document.getElementById("root");

if (container) {
    const root = createRoot(container);
    // chrome.runtime.id는 iframe 내부에서 직접 접근 가능
    root.render(<App extensionId={chrome.runtime.id} />);
} else {
    console.error("Root container를 찾을 수 없습니다.");
}
