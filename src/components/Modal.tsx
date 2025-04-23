import React from "react";
import styled from "@emotion/styled";

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
    background-color: rgba(0, 0, 0, 0.5);
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    z-index: 10000;
`;

const ModalContainer = styled.div`
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280; /* gray-500 */

    &:hover {
        color: #1f2937; /* gray-800 */
    }
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // 모달 외부 클릭 시 닫기
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
            <ModalContainer className="font-sans">
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {children}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default Modal;
