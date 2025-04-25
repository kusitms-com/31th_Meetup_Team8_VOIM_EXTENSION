import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FloatingButton } from "../component";

const meta: Meta<typeof FloatingButton> = {
    title: "Components/FloatingButton",
    component: FloatingButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: { action: "clicked" },
        iconUrl: { control: "text" },
    },
};

export default meta;
type Story = StoryObj<typeof FloatingButton>;

export const Default: Story = {
    args: {
        iconUrl: "/public/icons/icon.png",
    },
};

export const CustomIcon: Story = {
    args: {
        iconUrl: "/public/icons/icon.png",
    },
};

export const LargeIcon: Story = {
    args: {
        iconUrl: "/public/icons/icon.png",
    },
    decorators: [
        (Story) => (
            <div style={{ transform: "scale(1.2)" }}>
                <Story />
            </div>
        ),
    ],
};

export const WithInteraction: Story = {
    args: {
        iconUrl: "https://via.placeholder.com/40/0000ff",
    },
    parameters: {
        docs: {
            description: {
                story: "버튼을 클릭하면 액션이 발생합니다.",
            },
        },
    },
    play: async ({ canvasElement, args }) => {
        // 여기에 Storybook의 play 함수를 사용하여 인터랙션 테스트를 추가할 수 있습니다.
        console.log("Play function executed");
    },
};
