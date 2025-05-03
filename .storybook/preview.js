import "../src/css/app.css";
import React from "react";
import { ThemeProvider } from "@src/contexts/ThemeContext";

const preview = {
    decorators: [
        (StoryFn) => (
            <ThemeProvider>
                <Global />
                <StoryFn />
            </ThemeProvider>
        ),
    ],
};

export default preview;
