import React, { useState } from "react";

import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menubar";
import { MenubarButton } from "@src/components/menubarButton";

import { AppThemeProvider } from "@src/contexts/ThemeContext";
import "../css/app.css";
import { CursorProvider } from "@src/contexts/CursorContext";
import { BaseButton } from "@src/components/baseButton/component";
import { CursorTab } from "@src/components/cursorTab";

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
            return <CursorTab />;
        case "font":
            return (
                <div>
                    <BaseButton
                        onClick={() => console.log()}
                        isSelected={false}
                    >
                        choigo
                    </BaseButton>
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

const menuItems = [
    { id: "high-contrast", text: "고대비 화면 사용하기" },
    { id: "cursor", text: "마우스 커서 설정하기" },
    { id: "font", text: "글자 설정하기" },
    { id: "shortcut", text: "단축키 안내 보기" },
    { id: "service", text: "서비스 설정하기" },
    { id: "profile", text: "내 정보 설정하기" },
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
        <AppThemeProvider>
            <CursorProvider>
                <div className="pointer-events-auto">
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
                        <div
                            className={`fixed right-[510px] top-[70px]  p-5 overflow-y-auto z-[999] transition-transform duration-300 ${
                                isModalOpen && selectedMenu !== null
                                    ? "flex"
                                    : "hidden"
                            }`}
                        >
                            <PanelContent menuId={selectedMenu} />
                        </div>
                    </Menubar>
                </div>
            </CursorProvider>
        </AppThemeProvider>
    );
};

export default App;
