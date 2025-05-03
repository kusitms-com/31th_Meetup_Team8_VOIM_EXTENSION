import React from "react";
import { useAppTheme } from "@src/contexts/ThemeContext";
import { CheckmarkIcon } from "../checkmarkIcon";

interface MenubarButtonProps {
    isSelected: boolean;
    text: string;
    ariaLabel: string;
    onClick?: () => void;
}

export function MenubarButton({
    isSelected,
    text,
    onClick,
    ariaLabel,
}: MenubarButtonProps): JSX.Element {
    const { theme: themeMode } = useAppTheme();
    const isDarkMode = themeMode === "dark";

    return (
        <button
            onClick={onClick}
            className={`font-32-Bold font-koddi cursor-pointer flex items-center justify-between rounded-[14px] w-[420px] h-[88px] p-5 
                ${
                    isSelected
                        ? isDarkMode
                            ? "bg-grayscale-800 text-grayscale-100 hover:bg-grayscale-700"
                            : "bg-grayscale-100 text-grayscale-900 border-4 border-solid border-purple-default"
                        : isDarkMode
                          ? "bg-grayscale-700 text-grayscale-200 hover:bg-grayscale-600"
                          : "bg-grayscale-100 text-grayscale-900 hover:opacity-30"
                }`}
            role="menuitem"
            aria-label={ariaLabel}
            tabIndex={0}
            aria-selected={isSelected}
            aria-controls="menubar"
            aria-haspopup="menu"
        >
            {text}
            {isSelected ? <CheckmarkIcon /> : ""}
        </button>
    );
}
