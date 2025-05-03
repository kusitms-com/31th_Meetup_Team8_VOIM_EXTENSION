import React from "react";
import styled from "@emotion/styled";
import { getExtensionUrl } from "@src/utils/getExtensionUrl";
import { logger } from "@src/utils/logger";
import { SettingsResetButton } from "../settingsResetButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(15px);
`;

const ModalContainer = styled.div`
    position: fixed;
    top: 70px;
    right: 20px;
    border-radius: 30px;
    width: 460px;
    padding: 20px;
    overflow-y: auto;
    background-color: #fefefe;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
`;

export function Menubar({ isOpen, onClose, children }: ModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleResetSettings = () => {
        chrome.runtime
            .sendMessage({
                type: "RESET_SETTINGS",
            })
            .then((response) => {
                if (response && response.success) {
                    logger.debug("설정이 초기화되었습니다.");
                }
            })
            .catch((error) => {
                logger.error("메시지 전송 중 오류:", error);
            });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClick={handleOverlayClick}
            data-testid="menubar-overlay"
        >
            <ModalContainer
                className="font-koddi bg-grayscale-100"
                data-testid="menubar-container"
            >
                <div className="flex justify-between mb-6 font-24-Bold">
                    <SettingsResetButton onClick={handleResetSettings} />
                    <button
                        onClick={onClose}
                        className="py-[18px] cursor-pointer"
                        data-testid="close-button"
                    >
                        <img
                            src={getExtensionUrl("delete.png")}
                            alt="나가기"
                            data-testid="close-icon"
                        />
                    </button>
                </div>

                <div
                    className="flex flex-col gap-5"
                    data-testid="menubar-content"
                >
                    {children}
                </div>
            </ModalContainer>
        </ModalOverlay>
    );
}

export default Menubar;
