import React from "react";
import styled from "@emotion/styled";

interface ButtonProps {
    isSelected: boolean;
    theme?: boolean;
}

const Button = styled.button<ButtonProps>`
    padding: 20px 20px;
    width: 420px;
    height: 80px;
    border-radius: 14px;
    text-align: left;
`;

// // // //
interface MenubarButtonProps {
    isSelected: boolean;
    text: string;
    theme?: boolean;
    onClick?: () => void;
}

export function MenubarButton({
    isSelected,
    text,
    theme,
    onClick,
}: MenubarButtonProps): JSX.Element {
    return (
        <Button
            isSelected={isSelected}
            onClick={onClick}
            theme={theme}
            className={`${
                isSelected
                    ? "bg-grayscale-900 text-grayscale-200"
                    : "text-grayscale-900 hover:bg-grayscale-200"
            } font-32-Bold `}
        >
            {text}
        </Button>
    );
}
