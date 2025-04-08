import * as React from "react";
import { Popup } from "../component";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Popup> = {
    title: "Components/Popup",
    component: Popup,
    parameters: {
        docs: {
            description: {
                component:
                    "팝업 컴포넌트입니다. 사용자의 특정 행동에 따라 정보를 보여주거나 알림을 줄 때 사용됩니다.",
            },
        },
    },
    argTypes: {
        isOpen: {
            description: "팝업이 열려 있는지 여부",
            control: "boolean",
            defaultValue: false,
        },
        onClose: {
            description: "팝업을 닫는 함수",
            action: "closed",
        },
        children: {
            description: "팝업 안에 들어갈 내용",
            control: false,
        },
    },
};

export default meta;

type Story = StoryObj<typeof Popup>;

export const Default: Story = {
    args: {
        isOpen: true,
        children: <div>안녕하세요! 이건 팝업입니다.</div>,
    },
};
