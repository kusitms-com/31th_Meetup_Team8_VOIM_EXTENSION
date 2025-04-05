import "../src/css/app.css";
import React from "react";
import { Global, css } from "@emotion/react";

const preview = {
    decorators: [
        (StoryFn) => (
            <>
                <Global
                    styles={css`
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    `}
                />
                <StoryFn />
            </>
        ),
    ],
};

export default preview;
