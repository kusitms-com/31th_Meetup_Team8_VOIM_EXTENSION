import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { logger } from "@src/utils/logger";

const container = document.getElementById("root");

if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    logger.error("Root container를 찾을 수 없습니다.");
}
