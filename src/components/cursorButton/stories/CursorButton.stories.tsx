import { Meta, StoryObj } from "@storybook/react";
import { CursorButton } from "../component";

const meta: Meta<typeof CursorButton> = {
    title: "Components/CursorButton",
    component: CursorButton,
    tags: ["autodocs"],
    argTypes: {
        color: {
            control: "radio",
            options: ["white", "yellow", "purple"],
        },
        size: {
            control: "radio",
            options: ["small", "medium", "large"],
        },
        onClick: { action: "clicked" },
    },
};

export default meta;
type Story = StoryObj<typeof CursorButton>;

export const Default: Story = {
    args: {
        color: "white",
        size: "medium",
    },
};

export const YellowLarge: Story = {
    args: {
        color: "yellow",
        size: "large",
    },
};

export const PurpleSmall: Story = {
    args: {
        color: "purple",
        size: "small",
    },
};
