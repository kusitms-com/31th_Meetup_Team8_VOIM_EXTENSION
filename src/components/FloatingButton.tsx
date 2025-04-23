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

const FloatingButton = ({ onClick, iconUrl }: FloatingButtonProps) => {
    console.log("FloatingButton iconUrl:", iconUrl);
    return (
        <ButtonContainer onClick={onClick} className="select-none">
            <img src={iconUrl} alt="Floating Button" />
        </ButtonContainer>
    );
};

export default FloatingButton;
