import React, { useState } from "react";
import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menu";
import { MenubarButton } from "@src/components/menubarButton";
import "../css/app.css";

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const extensionId = chrome.runtime.id;
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <FloatingButton onClick={openModal} />
            <Menubar isOpen={isModalOpen} onClose={closeModal}>
                <MenubarButton isSelected={false} text="고대비 모드" />
                <MenubarButton isSelected={false} text="커서 크기 및 색상" />
                <MenubarButton isSelected={false} text="글자 설정" />
                <MenubarButton isSelected={false} text="서비스 설정" />
                <MenubarButton isSelected={false} text="내 정보 설정" />
            </Menubar>
        </>
    );
};

export default App;
