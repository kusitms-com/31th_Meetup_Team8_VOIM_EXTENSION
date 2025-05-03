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

interface PanelProps {
    isOpen: boolean;
}

const Panel = styled.div<PanelProps>`
    position: fixed;
    right: 510px;
    top: 70px;
    width: 320px;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow-y: auto;
    z-index: 999;
    transition: transform 0.3s ease;
    display: ${(props) => (props.isOpen ? "flex" : "none")};
`;

const menuItems = [
    { id: "high-contrast", text: "고대비 화면 사용하기" },
    { id: "cursor", text: "커서 크기 및 색상 설정하기" },
    { id: "font", text: "글자 설정하기" },
    { id: "shortcut", text: "단축키 안내 보기" },
    { id: "service", text: "서비스 설정하기" },
    { id: "profile", text: "내 정보 설정하기" },
];

interface PanelContentProps {
    menuId: string | null;
}

const PanelContent: React.FC<PanelContentProps> = ({ menuId }) => {
    switch (menuId) {
        case "high-contrast":
            return (
                <div>
                    <h2>고대비 화면 설정</h2>
                    <p>고대비 화면 설정 내용이 여기에 표시됩니다.</p>
                </div>
            );
        case "cursor":
            return (
                <div>
                    <h2>커서 설정</h2>
                    <p>커서 크기 및 색상 설정 내용이 여기에 표시됩니다.</p>
                </div>
            );
        case "font":
            return (
                <div>
                    <h2>글자 설정</h2>
                    <p>글자 크기 및 폰트 설정 내용이 여기에 표시됩니다.</p>
                </div>
            );
        case "shortcut":
            return (
                <div>
                    <h2>단축키 안내</h2>
                    <p>단축키 안내 내용이 여기에 표시됩니다.</p>
                </div>
            );
        case "service":
            return (
                <div>
                    <h2>서비스 설정</h2>
                    <p>서비스 설정 내용이 여기에 표시됩니다.</p>
                </div>
            );
        case "profile":
            return (
                <div>
                    <h2>내 정보 설정</h2>
                    <p>내 정보 설정 내용이 여기에 표시됩니다.</p>
                </div>
            );
        default:
            return null;
    }
};

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
                    <Panel isOpen={isModalOpen && selectedMenu !== null}>
                        <PanelContent menuId={selectedMenu} />
                    </Panel>
                </Menubar>
            </AppWrapper>
        </ThemeProvider>
    );
};

export default App;
