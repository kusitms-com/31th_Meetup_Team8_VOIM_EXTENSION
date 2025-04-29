import React from "react";
import styled from "@emotion/styled";
import { getExtensionUrl } from "@src/background/utils/getExtensionUrl";

interface FloatingButtonProps {
    onClick: () => void;
}

const ButtonContainer = styled.div`
    position: fixed;
    width: 58px;
    right: 5px;
    top: 5px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;
    transition: all 0.2s ease-in-out;
    &:hover {
        transform: scale(1.05);
    }
`;

const ButtonImage = styled.img`
    width: 100%;
    height: 100%;
    max-width: 58px;
    max-height: 58px;
    object-fit: contain;
`;

export function FloatingButton({ onClick }: FloatingButtonProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleClick = () => {
        setIsMenuOpen((prev) => !prev);
        onClick();
    };

    return (
        <ButtonContainer
            onClick={handleClick}
            role="button"
            aria-haspopup="menu"
            aria-controls="menubar"
            aria-expanded={isMenuOpen}
            aria-label="VOIM"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick();
                }
            }}
        >
            <ButtonImage
                src={getExtensionUrl("icon.png")}
                alt="VOIM 익스텐션"
                aria-hidden="true"
            />
        </ButtonContainer>
    );
}
