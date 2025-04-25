import React from "react";
import styled from "@emotion/styled";

interface FloatingButtonProps {
    onClick: () => void;
    iconUrl: string;
}

const ButtonContainer = styled.div`
    position: fixed;
    top: 70px;
    right: 20px;
    width: 58px;
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

export function FloatingButton({ onClick, iconUrl }: FloatingButtonProps) {
    console.log("FloatingButton iconUrl:", iconUrl);
    return (
        <ButtonContainer onClick={onClick} className="select-none">
            <ButtonImage src={iconUrl} alt="Floating Button" />
        </ButtonContainer>
    );
}
