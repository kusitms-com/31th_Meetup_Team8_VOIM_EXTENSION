import * as React from "react";
import { Hello } from "../component";
import { Meta } from "@storybook/react";

// // // //

export default {
    title: "Components/Hello",
    component: Hello,
} as Meta<typeof Hello>;

export const Render = () => <Hello />;
