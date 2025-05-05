import React from "react";
import { CursorButton } from "../component";
import { Meta, StoryObj } from "@storybook/react";

export default {
    title: "Components/CursorButton",
    component: CursorButton,
    argTypes: {
        color: {
            control: "radio",
            options: ["white", "purple", "yellow", "mint", "pink", "black"],
        },
        size: {
            control: "radio",
            options: ["small", "medium", "large"],
        },
        isSelected: {
            control: "boolean",
        },
    },
} as Meta;

const Template: StoryObj<typeof CursorButton> = {
    render: (args) => (
        <div className="flex justify-around gap-4">
            <CursorButton {...args} />
        </div>
    ),
};

export const Default: StoryObj<typeof CursorButton> = {
    ...Template,
    args: {
        onClick: () => alert("Cursor clicked"),
        color: "white",
        size: "medium",
        isSelected: false,
    },
};

export const Selected: StoryObj<typeof CursorButton> = {
    ...Template,
    args: {
        onClick: () => alert("Cursor clicked"),
        color: "purple",
        size: "large",
        isSelected: true,
    },
};

export const DarkMode: StoryObj<typeof CursorButton> = {
    ...Template,
    args: {
        onClick: () => alert("Cursor clicked"),
        color: "mint",
        size: "small",
        isSelected: false,
    },
};
