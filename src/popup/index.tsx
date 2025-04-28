import * as React from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { Popup } from "./component";
import "../css/app.css";

// // // //

browser.tabs
    .query({ active: true, currentWindow: true })
    .then(() => {
        return new Promise<void>((resolve) => {
            if (document.readyState === "complete") {
                resolve();
            } else {
                document.addEventListener("DOMContentLoaded", () => resolve());
            }
        });
    })
    .then(() => {
        const container = document.getElementById("popup");
        if (container) {
            const root = createRoot(container);
            root.render(<Popup />);
        }
    });
