import React, { useState } from "react";
import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menu";
import { MenubarButton } from "@src/components/menubarButton";
import "../css/app.css";

interface AppProps {
    extensionId: string;
}
const App = ({ extensionId }: AppProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <FloatingButton
                onClick={openModal}
                iconUrl={`chrome-extension://${extensionId}/icons/icon.png`}
            />
            <Menubar
                url={`chrome-extension://${extensionId}`}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
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
