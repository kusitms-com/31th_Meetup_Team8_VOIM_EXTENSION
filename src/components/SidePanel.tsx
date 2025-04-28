import React from "react";
import styled from "@emotion/styled";

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const SidePanelOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: ${(props) => (props.isOpen ? "block" : "none")};
    z-index: 9998;
`;

const SidePanelContainer = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 70px;
    right: 20px;
    width: 460px;
    height: 726px;
    background-color: white;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    z-index: 9999;
    display: ${(props) => (props.isOpen ? "block" : "none")};
    transition: transform 0.3s ease;
    overflow-y: auto;
`;

const PanelHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eaeaea;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #6b7280;
    &:hover {
        color: #1f2937;
    }
`;

const PanelContent = styled.div`
    padding: 16px;
`;

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, children }) => {
    // 패널 외부 클릭 시 닫기
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <SidePanelOverlay isOpen={isOpen} onClick={handleOverlayClick} />
            <SidePanelContainer isOpen={isOpen}>
                <PanelHeader>
                    <h3 className="text-lg font-semibold">익스텐션 패널</h3>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </PanelHeader>
                <PanelContent>{children}</PanelContent>
            </SidePanelContainer>
        </>
    );
};

export default SidePanel;
