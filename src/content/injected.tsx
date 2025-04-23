import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById(
    "floating-button-extension-container",
);

if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
