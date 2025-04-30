import React from "react";
import { TextButton } from "../component";
import { Meta, StoryObj } from "@storybook/react";

export default {
    title: "Components/TextButton",
    component: TextButton,
    argTypes: {
        onClick: { action: "clicked" },
    },
} as Meta<typeof TextButton>; // Meta 타입에 TextButton 지정

type Story = StoryObj<typeof TextButton>; // StoryObj 타입에 TextButton 지정

export const Default: Story = {
    args: {
        children: "설정 초기화",
        onClick: () => {}, // console.log 제거
    },
};

export const WithAriaLabel: Story = {
    args: {
        children: "설정 초기화",
        onClick: () => {}, // console.log 제거
        ariaLabel: "설정 초기화 버튼",
    },
};

export const Disabled: Story = {
    args: {
        children: "설정 초기화",
        onClick: () => {}, // console.log 제거
    },
};

export const IconOnly: Story = {
    args: {
        children: (
            <svg width="24" height="24" fill="none">
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                />
            </svg>
        ),
        onClick: () => {}, // console.log 제거
    },
};
