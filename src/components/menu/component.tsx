import React from "react";
import styled from "@emotion/styled";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    url: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    z-index: 10000;
`;

const ModalContainer = styled.div`
    position: fixed;
    top: 70px;
    right: 20px;
    border-radius: 0.5rem;
    width: 460px;
    padding: 20px;
    overflow-y: auto;
    background-color: #fefefe;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
`;

export function Menubar({ isOpen, onClose, children, url }: ModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
            <ModalContainer className="font-koddi bg-grayscale-100">
                <div className="flex justify-between mb-6 font-24-Bold">
                    <div className="px-6 py-[18px] flex gap-[10px] items-center cursor-pointer">
                        <img
                            src={url + "/assets/images/arrow-rotate.png"}
                            alt="설정 초기화"
                        />
                        <div>설정 초기화</div>
                    </div>
                    <div onClick={onClose} className="py-[18px] cursor-pointer">
                        <img
                            src={url + "/assets/images/delete.png"}
                            alt="나가기"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-5">{children}</div>
            </ModalContainer>
        </ModalOverlay>
    );
}

export default Menubar;
