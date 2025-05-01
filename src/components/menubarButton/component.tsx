import React from "react";
import styled from "@emotion/styled";
import theme from "@src/css/theme";

interface ButtonProps {
    isSelected: boolean;
    theme?: boolean;
    onClick?: () => void;
}

const Button = styled.button<ButtonProps>`
    background-color: ${(props) =>
        props.isSelected
            ? theme.colors.grayscale[900]
            : theme.colors.grayscale[100]};
    color: ${(props) =>
        props.isSelected
            ? theme.colors.grayscale[200]
            : theme.colors.grayscale[900]};
    &:hover {
        background-color: ${(props) =>
            props.isSelected
                ? theme.colors.grayscale[900]
                : theme.colors.grayscale[200]};
    }
`;

interface MenubarButtonProps {
    isSelected: boolean;
    text: string;
    theme?: boolean;
    ariaLabel: string;
    onClick?: () => void;
}

export function MenubarButton({
    isSelected,
    text,
    theme,
    onClick,
    ariaLabel,
}: MenubarButtonProps): JSX.Element {
    return (
        <Button
            isSelected={isSelected}
            onClick={onClick}
            theme={theme}
            className="font-32-Bold font-koddi cursor-pointer flex items-center rounded-[14px] w-[420px] h-[80px] p-5"
            role="menuitem"
            aria-label={ariaLabel}
            tabIndex={0}
            aria-selected={isSelected}
            aria-controls="menubar"
            aria-haspopup="menu"
        >
            {text}
        </Button>
    );
}
