import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Menubar from "../component";
import { MenubarButton } from "../../menubarButton";

const meta: Meta<typeof Menubar> = {
    title: "components/Menubar",
    component: Menubar,
};

export default meta;
type Story = StoryObj<typeof Menubar>;

// mock getExtensionUrl
import("@src/utils/getExtensionUrl")
    .then((module) => {
        (
            module as { getExtensionUrl: (path: string) => string }
        ).getExtensionUrl = (path: string) => `/mock-assets/${path}`;
    })
    .catch(() => {});

// mock logger
import("@src/utils/logger")
    .then((module) => {
        (
            module as {
                logger: {
                    debug: (...args: unknown[]) => void;
                    error: (...args: unknown[]) => void;
                };
            }
        ).logger = {
            debug: () => {},
            error: console.error,
        };
    })
    .catch(() => {});

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: () => {},
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
        onClose: () => {},
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
        onClose: () => {},
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
        onClose: () => {},
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
