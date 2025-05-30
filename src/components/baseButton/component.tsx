import { useTheme } from "@src/contexts/ThemeContext";
import React from "react";
import { CheckmarkIcon } from "../icons";

interface BaseButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
    isSelected?: boolean;
    nonCheck?: boolean;
    isFull?: boolean;
    "data-testid"?: string;
}

export function BaseButton({
    children,
    onClick,
    ariaLabel,
    isSelected = false,
    nonCheck = false,
    isFull = false,
    "data-testid": dataTestId,
}: BaseButtonProps) {
    const { theme, fontClasses } = useTheme();
    const isDarkMode = theme === "dark";

    return (
        <button
            className={`font-koddi ${fontClasses.fontCommon} py-[16px] px-[30px] relative rounded-[14px] ${isFull ? "w-full" : ""} text-center ${
                isSelected
                    ? isDarkMode
                        ? "bg-grayscale-900 text-grayscale-100 border-4 border-solid border-purple-light"
                        : "bg-grayscale-100 text-grayscale-900 border-4 border-solid border-purple-default"
                    : isDarkMode
                      ? "bg-grayscale-900 text-grayscale-100 hover:opacity-30 border-4 border-solid border-grayscale-700 active:border-purple-light active:hover:opacity-100"
                      : "bg-grayscale-100 text-grayscale-900 hover:opacity-30 border-4 border-solid border-grayscale-300 active:border-purple-default active:hover:opacity-100"
            }`}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={isSelected}
            data-testid={dataTestId}
        >
            {children}
            {isSelected && !nonCheck && (
                <CheckmarkIcon
                    className="absolute -right-[10px] -top-[10px]"
                    data-testid="checkmark-icon"
                />
            )}
        </button>
    );
}
