import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { BaseButton } from "../component";

type ButtonColor = "gray" | "white" | "purple" | "black" | "yellow" | "dark";

const meta: Meta<typeof BaseButton> = {
    title: "Components/BaseButton",
    component: BaseButton,
    argTypes: {
        onClick: { action: "clicked" },
        color: {
            control: {
                type: "select",
                options: ["gray", "white", "purple", "black", "yellow", "dark"],
            },
        },
        isSelected: { control: "boolean" },
        ariaLabel: { control: "text" },
        children: { control: "text" },
    },
};

export default meta;

type Story = StoryObj<typeof BaseButton>;

export const AllColors: Story = {
    render: (args: React.ComponentProps<typeof BaseButton>) => {
        const colors: ButtonColor[] = [
            "gray",
            "white",
            "purple",
            "yellow",
            "black",
            "dark",
        ];

        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {colors.map((color) => (
                    <BaseButton
                        key={color}
                        {...args}
                        color={color}
                        ariaLabel={`${color} 버튼`}
                    >
                        {color}
                    </BaseButton>
                ))}
            </div>
        );
    },
    args: {
        isSelected: false,
        onClick: () => {},
    },
};

export const SelectedState: Story = {
    render: (args: React.ComponentProps<typeof BaseButton>) => {
        const colors: ButtonColor[] = [
            "gray",
            "white",
            "purple",
            "yellow",
            "black",
            "dark",
        ];

        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {colors.map((color) => (
                    <BaseButton
                        key={color}
                        {...args}
                        color={color}
                        isSelected
                        ariaLabel={`${color} 선택된 버튼`}
                    >
                        {color}
                    </BaseButton>
                ))}
            </div>
        );
    },
    args: {
        onClick: () => {},
    },
};
