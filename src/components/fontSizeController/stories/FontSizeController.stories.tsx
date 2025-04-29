import { FontSizeController } from "../component";
import { Meta, StoryObj } from "@storybook/react";

export default {
    title: "Components/FontSizeController",
    component: FontSizeController,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        textSize: {
            control: "number",
            description: "Font size of the text",
            defaultValue: 28,
        },
    },
} as Meta<typeof FontSizeController>;

type Story = StoryObj<typeof FontSizeController>;

export const Default: Story = {
    args: {
        textSize: 28,
    },
};
