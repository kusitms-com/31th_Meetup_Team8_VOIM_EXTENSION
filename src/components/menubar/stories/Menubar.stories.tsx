import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Menubar from "../component";
import { MenubarButton } from "../../menubarButton";
import { action } from "@storybook/addon-actions";
import { logger } from "@src/utils/logger";

const mockGetExtensionUrl = (path: string) => `/mock-assets/${path}`;
const mockChrome = {
    runtime: {
        sendMessage: () => Promise.resolve({ success: true }),
    },
};

if (typeof global.chrome === "undefined") {
    global.chrome = mockChrome as unknown as typeof chrome;
}

jest.mock("@src/background/utils/getExtensionUrl", () => ({
    getExtensionUrl: (path: string) => mockGetExtensionUrl(path),
}));

jest.mock("@src/utils/logger", () => ({
    logger: {
        debug: (message: string) => {
            logger.debug(message);
        },
        error: (message: string, error: Error) => console.error(message, error),
    },
}));

export default {
    title: "Components/Menubar",
    component: Menubar,
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "light",
            values: [
                { name: "light", value: "#FFFFFF" },
                { name: "dark", value: "#333333" },
            ],
        },
    },
    argTypes: {
        isOpen: {
            control: "boolean",
            description: "메뉴바가 열려있는지 여부",
            defaultValue: true,
        },
        onClose: {
            action: "closed",
            description: "메뉴바를 닫을 때 호출되는 함수",
        },
        children: {
            description: "메뉴바 내부에 표시할 콘텐츠",
        },
    },
    decorators: [
        (Story) => (
            <div style={{ height: "100vh", position: "relative" }}>
                <Story />
            </div>
        ),
    ],
} as Meta<typeof Menubar>;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: action("onClose"),
        children: (
            <>
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 1"
                    ariaLabel="메뉴 항목 1"
                />
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 2"
                    ariaLabel="메뉴 항목 2"
                />
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 3"
                    ariaLabel="메뉴 항목 3"
                />
            </>
        ),
    },
};

export const WithSelectedItem: Story = {
    args: {
        isOpen: true,
        onClose: action("onClose"),
        children: (
            <>
                <MenubarButton
                    isSelected={true}
                    text="선택된 메뉴 항목"
                    ariaLabel="선택된 메뉴 항목"
                />
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 2"
                    ariaLabel="메뉴 항목 2"
                />
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 3"
                    ariaLabel="메뉴 항목 3"
                />
            </>
        ),
    },
};

export const Closed: Story = {
    args: {
        isOpen: false,
        onClose: action("onClose"),
        children: (
            <>
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 1"
                    ariaLabel="메뉴 항목 1"
                />
                <MenubarButton
                    isSelected={false}
                    text="메뉴 항목 2"
                    ariaLabel="메뉴 항목 2"
                />
            </>
        ),
    },
};

export const WithManyItems: Story = {
    args: {
        isOpen: true,
        onClose: action("onClose"),
        children: (
            <>
                {Array.from({ length: 10 }).map((_, index) => (
                    <MenubarButton
                        key={index}
                        isSelected={index === 2}
                        text={`메뉴 항목 ${index + 1}`}
                        ariaLabel={`메뉴 항목 ${index + 1}`}
                    />
                ))}
            </>
        ),
    },
};

export const Interactive: Story = {
    render: (_args) => {
        const [isOpen, setIsOpen] = React.useState(true);
        const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
            null,
        );

        const handleClose = () => {
            setIsOpen(false);
            action("onClose")();
        };

        const handleToggle = () => {
            setIsOpen((prev) => !prev);
        };

        const menuItems = [
            "고대비 모드",
            "커서 크기 및 색상",
            "글자 설정",
            "서비스 설정",
            "내 정보 설정",
        ];

        return (
            <div>
                <button
                    onClick={handleToggle}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginBottom: "16px",
                    }}
                >
                    {isOpen ? "메뉴바 닫기" : "메뉴바 열기"}
                </button>

                <Menubar isOpen={isOpen} onClose={handleClose}>
                    {menuItems.map((item, index) => (
                        <MenubarButton
                            key={index}
                            isSelected={selectedIndex === index}
                            text={item}
                            ariaLabel={`${item} 선택`}
                            onClick={() =>
                                setSelectedIndex(
                                    index === selectedIndex ? null : index,
                                )
                            }
                        />
                    ))}
                </Menubar>
            </div>
        );
    },
};
