import React, { useState } from "react";
import styled from "@emotion/styled";

import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menubar";
import { MenubarButton } from "@src/components/menubarButton";

import "../css/app.css";

const AppWrapper = styled.div`
    pointer-events: auto;
`;

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

    const menuItems = [
        { id: "high-contrast", text: "고대비 모드" },
        { id: "cursor", text: "커서 크기 및 색상" },
        { id: "font", text: "글자 설정" },
        { id: "service", text: "서비스 설정" },
        { id: "profile", text: "내 정보 설정" },
    ];

    const openModal = () => {
        setIsModalOpen(true);
        window.parent.postMessage({ type: "RESIZE_IFRAME", isOpen: true }, "*");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMenu(null);
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: false },
            "*",
        );
    };
    const handleMenuClick = (menuId: string) => {
        setSelectedMenu(menuId === selectedMenu ? null : menuId);
    };
    return (
        <AppWrapper>
            <FloatingButton onClick={openModal} />
            <Menubar isOpen={isModalOpen} onClose={closeModal}>
                {menuItems.map((item) => (
                    <MenubarButton
                        key={item.id}
                        isSelected={selectedMenu === item.id}
                        text={item.text}
                        onClick={() => handleMenuClick(item.id)}
                        ariaLabel={`${item.text} 선택`}
                    />
                ))}
            </Menubar>
        </AppWrapper>
    );
};

export default App;
