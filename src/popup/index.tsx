import * as React from "react";
import * as ReactDOM from "react-dom";
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
        ReactDOM.render(<Popup />, document.getElementById("popup"));
    });
