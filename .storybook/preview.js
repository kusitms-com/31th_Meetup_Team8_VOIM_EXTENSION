import "../src/css/app.css";
import React from "react";
import { Global, css } from "@emotion/react";
import { ThemeProvider } from "@src/contexts/ThemeContext";

const preview = {
    decorators: [
        (StoryFn) => (
            <ThemeProvider>
                <Global
                    styles={css`
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    `}
                />
                <StoryFn />
            </ThemeProvider>
        ),
    ],
};

export default preview;
