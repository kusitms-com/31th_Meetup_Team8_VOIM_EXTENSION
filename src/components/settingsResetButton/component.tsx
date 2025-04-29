import React from "react";
import styled from "@emotion/styled";
import { useThemeMode } from "@src/contexts/ThemeContext";
import theme from "@src/css/theme";

interface SettingsResetButtonProps {
    onClick: () => void;
}

const themeStyles = {
    dark: `
        background-color: ${theme.colors.grayscale[800]};
        color: ${theme.colors.grayscale[100]};
        
        &:hover {
            background-color: ${theme.colors.grayscale[800]};
            color: ${theme.colors.grayscale[500]};
        }
        &:active {
            background-color: ${theme.colors.grayscale[100]};
            color: ${theme.colors.grayscale[900]};
        }
        
        svg path {
            stroke: currentColor;
        }
    `,
    yellow: `
        background-color: #ff0;
        color: #000;
        
        svg path {
            stroke: currentColor;
        }
    `,
    light: `
        background-color: ${theme.colors.grayscale[200]};
        color: ${theme.colors.grayscale[900]};
        
        &:hover {
            background-color: ${theme.colors.grayscale[200]};
            color: ${theme.colors.grayscale[500]};
        }
        &:active {
            background-color: ${theme.colors.grayscale[900]};
            color: ${theme.colors.grayscale[100]};
        }
        
        svg path {
            stroke: currentColor;
        }
    `,
};

const Button = styled.button<{ themeMode: "dark" | "yellow" | "light" }>`
    ${({ themeMode }) => themeStyles[themeMode] || themeStyles.light}
`;

export function SettingsResetButton({ onClick }: SettingsResetButtonProps) {
    const { theme: themeMode } = useThemeMode();

    return (
        <Button
            themeMode={themeMode}
            className="px-6 py-[18px] flex gap-[10px] items-center cursor-pointer rounded-[14px] font-24-Bold font-koddi"
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
            >
                <path
                    d="M7.30673 21.75C8.8337 26.5409 13.207 30 18.3636 30C24.7902 30 30 24.6274 30 18C30 11.3726 24.7902 6 18.3636 6C14.0565 6 10.296 8.41319 8.28401 12M11.8182 13.5H6V7.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div data-testid="reset-settings-text">설정 초기화</div>
        </Button>
    );
}
