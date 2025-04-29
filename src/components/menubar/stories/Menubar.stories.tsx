import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import Menubar from "../component";

import { MenubarButton } from "@src/components/menubarButton";
import { FloatingButton } from "@src/components/floatingButton";

const meta: Meta<typeof Menubar> = {
    title: "Components/Menubar",
    component: Menubar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Menubar>;

const MenubarController: React.FC<{ initialState?: boolean }> = ({
    initialState = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(initialState);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <FloatingButton onClick={openModal} />
            <Menubar isOpen={isModalOpen} onClose={closeModal}>
                <MenubarButton isSelected={false} text="고대비 모드" />
                <MenubarButton isSelected={false} text="커서 크기 및 색상" />
                <MenubarButton isSelected={false} text="글자 설정" />
                <MenubarButton isSelected={false} text="서비스 설정" />
                <MenubarButton isSelected={false} text="내 정보 설정" />
            </Menubar>
        </div>
    );
};

export const Default: Story = {
    render: () => <MenubarController initialState={false} />,
};

export const InitiallyOpen: Story = {
    render: () => <MenubarController initialState={true} />,
};
