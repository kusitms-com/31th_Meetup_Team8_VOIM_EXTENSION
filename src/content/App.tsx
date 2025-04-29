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
    const openModal = () => {
        setIsModalOpen(true);
        window.parent.postMessage({ type: "RESIZE_IFRAME", isOpen: true }, "*");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: false },
            "*",
        );
    };

    return (
        <AppWrapper>
            <FloatingButton onClick={openModal} />
            <Menubar isOpen={isModalOpen} onClose={closeModal}>
                <MenubarButton isSelected={false} text="고대비 모드" />
                <MenubarButton isSelected={false} text="커서 크기 및 색상" />
                <MenubarButton isSelected={false} text="글자 설정" />
                <MenubarButton isSelected={false} text="서비스 설정" />
                <MenubarButton isSelected={false} text="내 정보 설정" />
            </Menubar>
        </AppWrapper>
    );
};

export default App;
