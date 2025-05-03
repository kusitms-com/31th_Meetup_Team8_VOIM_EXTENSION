import React from "react";
import { useThemeMode } from "@src/contexts/ThemeContext";

interface SettingsResetButtonProps {
    onClick: () => void;
}

export function SettingsResetButton({ onClick }: SettingsResetButtonProps) {
    const { theme: themeMode } = useThemeMode();

    // Tailwind 클래스를 조건부로 적용하기 위한 함수
    const getThemeClasses = () => {
        if (themeMode === "dark" || themeMode === "yellow") {
            return "bg-grayscale-800 text-grayscale-100 hover:text-grayscale-500 active:bg-grayscale-100 active:text-grayscale-900";
        } else {
            return "bg-grayscale-200 text-grayscale-900 hover:text-grayscale-500 active:bg-grayscale-900 active:text-grayscale-100";
        }
    };

    return (
        <button
            className={`px-6 py-[18px] flex gap-[10px] items-center cursor-pointer rounded-[14px] font-24-Bold font-koddi ${getThemeClasses()}`}
            onClick={onClick}
            data-testid="reset-settings-button"
            aria-label="설정 초기화"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                className="[&>path]:stroke-current"
            >
                <path
                    d="M7.30673 21.75C8.8337 26.5409 13.207 30 18.3636 30C24.7902 30 30 24.6274 30 18C30 11.3726 24.7902 6 18.3636 6C14.0565 6 10.296 8.41319 8.28401 12M11.8182 13.5H6V7.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div data-testid="reset-settings-text">설정 초기화</div>
        </button>
    );
}
