import React from "react";

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
        <button
            onClick={onClick}
            className={`font-32-Bold font-koddi cursor-pointer flex items-center rounded-[14px] w-[420px] h-[80px] p-5 
                ${
                    isSelected
                        ? "bg-grayscale-900 text-grayscale-200 hover:bg-grayscale-900"
                        : "bg-grayscale-100 text-grayscale-900 hover:bg-grayscale-200"
                }`}
            role="menuitem"
            aria-label={ariaLabel}
            tabIndex={0}
            aria-selected={isSelected}
            aria-controls="menubar"
            aria-haspopup="menu"
        >
            {text}
        </button>
    );
}
