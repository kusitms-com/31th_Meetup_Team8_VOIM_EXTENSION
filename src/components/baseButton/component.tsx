import React from "react";

interface BaseButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
    color?: "gray" | "white" | "purple" | "black" | "yellow" | "dark";
    isSelected?: boolean;
}

const buttonStyles = {
    gray: "bg-grayscale-200 text-grayscale-900 border-grayscale-300 hover:bg-grayscale-200 hover:border-grayscale-300 hover:text-grayscale-400 ",
    white: "bg-grayscale-100 text-grayscale-900 border-grayscale-300 hover:bg-grayscale-100 hover:border-grayscale-300 hover:text-grayscale-500",
    purple: "bg-purple-default text-grayscale-100 border-none hover:bg-purple-light hover:border-none hover:text-grayscale-100",
    yellow: "bg-yellow-default text-grayscale-900 border-none hover:bg-yellow-light hover:border-none hover:text-grayscale-600",
    black: "bg-grayscale-900 text-grayscale-100 border-grayscale-800 hover:bg-grayscale-800 hover:border-grayscale-800 hover:text-grayscale-500",
    dark: "bg-grayscale-800 text-grayscale-100 border-grayscale-800 hover:bg-grayscale-700 hover:border-grayscale-800 hover:text-grayscale-500",
};

const selectedStyles = {
    gray: "bg-grayscale-200 border-purple-default text-grayscale-900",
    white: "bg-grayscale-100 border-purple-default text-grayscale-900",
    purple: "bg-purple-default border-purple-default text-grayscale-100",
    yellow: "bg-yellow-default border-purple-default text-grayscale-900",
    black: "bg-grayscale-900 border-purple-default text-grayscale-100",
    dark: "bg-grayscale-800 border-purple-default text-grayscale-100",
};

const baseClasses =
    "rounded-[14px] w-[140px] h-[140px] flex items-center justify-center border-4 border-solid font-24-Regular font-koddi";

export function BaseButton({
    children,
    onClick,
    ariaLabel,
    color = "gray",
    isSelected = false,
}: BaseButtonProps) {
    const colorClasses = isSelected
        ? selectedStyles[color]
        : buttonStyles[color];

    return (
        <button
            className={`${baseClasses} ${colorClasses}`}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={isSelected}
        >
            {children}
        </button>
    );
}
