import { useTheme } from "@src/contexts/ThemeContext";
import React from "react";

interface ContentBoxProps {
    children: React.ReactNode;
    ariaLabel?: string;
}

export function ContentBox({ children, ariaLabel }: ContentBoxProps) {
    const { theme, fontClasses } = useTheme();

    const isDarkMode = theme === "dark";
    return (
        <div
            className={`${fontClasses.fontCommon} font-koddi px-[24px] py-[18px] rounded-[14px] flex justify-between gap-[110px] w-full
            ${isDarkMode ? `bg-grayscale-800 text-grayscale-100` : `bg-grayscale-200 text-grayscale-900`}`}
            aria-label={ariaLabel}
            tabIndex={0}
        >
            {children}
        </div>
    );
}
