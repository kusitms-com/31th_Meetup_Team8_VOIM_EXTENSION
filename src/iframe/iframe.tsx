import React, { useState } from "react";
import styled from "@emotion/styled";

import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menubar";
import { MenubarButton } from "@src/components/menubarButton";

import { ThemeProvider } from "@src/contexts/ThemeContext";
import "../css/app.css";

const AppWrapper = styled.div`
    pointer-events: auto;
`;

const menuItems = [
    { id: "high-contrast", text: "고대비 모드 사용하기" },
    { id: "cursor", text: "커서 크기 및 색상 설정하기" },
    { id: "font", text: "글자 설정 설정하기" },
    { id: "shortcut", text: "단축키 안내 보기" },
    { id: "service", text: "서비스 설정" },
    { id: "profile", text: "내 정보 설정" },
];

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

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
        <ThemeProvider>
            <AppWrapper>
                {!isModalOpen && <FloatingButton onClick={openModal} />}
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
        </ThemeProvider>
    );
};

export default App;
