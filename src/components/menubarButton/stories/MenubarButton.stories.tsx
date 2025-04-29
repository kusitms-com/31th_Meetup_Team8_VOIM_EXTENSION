import React from "react";
import { MenubarButton } from "../component";
import { Meta, StoryObj } from "@storybook/react";

export default {
    title: "Components/MenubarButton",
    component: MenubarButton,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        isSelected: {
            control: "boolean",
            description: "버튼이 선택되었는지 여부",
        },
        text: {
            control: "text",
            description: "버튼에 표시할 텍스트",
        },
        theme: {
            control: "boolean",
            description: "테마 적용 여부",
            defaultValue: false,
        },
    },
} as Meta<typeof MenubarButton>;

type Story = StoryObj<typeof MenubarButton>;

// 기본 상태 버튼
export const Default: Story = {
    args: {
        isSelected: false,
        text: "메뉴 버튼",
    },
};

// 선택된 상태 버튼
export const Selected: Story = {
    args: {
        isSelected: true,
        text: "선택된 메뉴 버튼",
    },
};

// 테마 적용 버튼
export const WithTheme: Story = {
    args: {
        isSelected: false,
        text: "테마 적용 버튼",
        theme: true,
    },
};

// 선택된 상태 + 테마 적용 버튼
export const SelectedWithTheme: Story = {
    args: {
        isSelected: true,
        text: "선택된 테마 버튼",
        theme: true,
    },
};

// 여러 버튼 상태 비교
export const ButtonStates: Story = {
    render: () => (
        <div className="flex flex-col space-y-4">
            <MenubarButton isSelected={false} text="기본 상태 버튼" />
            <MenubarButton isSelected={true} text="선택된 상태 버튼" />
            <MenubarButton
                isSelected={false}
                text="테마 적용 버튼"
                theme={true}
            />
            <MenubarButton
                isSelected={true}
                text="선택된 테마 버튼"
                theme={true}
            />
        </div>
    ),
};

// 긴 텍스트 버튼
export const LongText: Story = {
    args: {
        isSelected: false,
        text: "이것은 매우 긴 텍스트가 들어있는 메뉴 버튼입니다. 텍스트가 버튼 너비를 초과할 경우 어떻게 표시되는지 확인하기 위한 예시입니다.",
    },
};

// 동적 상태 변경 테스트
export const Interactive: Story = {
    render: () => {
        const [selected, setSelected] = React.useState(false);

        return (
            <div className="space-y-4">
                <p className="text-sm font-medium mb-2">
                    클릭하여 버튼 상태 변경:{" "}
                    {selected ? "선택됨" : "선택되지 않음"}
                </p>
                <MenubarButton
                    isSelected={selected}
                    text="클릭하여 상태 변경"
                    theme={true}
                    onClick={() => setSelected(!selected)}
                />
            </div>
        );
    },
};
