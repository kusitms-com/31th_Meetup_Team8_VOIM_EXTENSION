import { useAppTheme } from "@src/contexts/ThemeContext";
import React from "react";
import { CheckmarkIcon } from "../checkmarkIcon";

interface ModeButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
    isSelected?: boolean;
    modeType: "LIGHT" | "DARK";
}

export function ModeButton({
    children,
    onClick,
    ariaLabel,
    isSelected = false,
    modeType,
}: ModeButtonProps) {
    const { fontClasses } = useAppTheme();

    const base = `font-koddi ${fontClasses.fontCommon} py-[16px] px-[30px] relative rounded-[14px] w-[180px] h-[100px] text-center font-bold`;

    const styleByMode = {
        LIGHT: isSelected
            ? "bg-white text-black border-4 border-solid border-purple-default"
            : "bg-white text-black border-4 border-solid border-grayscale-300 hover:opacity-30 active:border-purple-default active:hover:opacity-100",
        DARK: isSelected
            ? "bg-black text-white border-4 border-solid border-purple-light"
            : "bg-black text-white border-4 border-solid border-grayscale-700 hover:opacity-30 active:border-purple-light active:hover:opacity-100",
    };

    return (
        <button
            className={`${base} ${styleByMode[modeType]}`}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={isSelected}
        >
            {children}
            {isSelected && (
                <CheckmarkIcon
                    className="absolute -right-[10px] -top-[10px]"
                    data-testid="checkmark-icon"
                />
            )}
        </button>
    );
}
