import React from "react";
import { BaseButton } from "../baseButton/component";
import { useAppTheme } from "@src/contexts/ThemeContext";
import { getExtensionUrl } from "@src/utils/getExtensionUrl";

interface CursorButtonProps {
    onClick: () => void;
    color?: "white" | "yellow" | "purple";
    size?: "small" | "medium" | "large";
}

export function CursorButton({
    onClick,
    color = "white",
    size = "medium",
}: CursorButtonProps) {
    const { theme } = useAppTheme();

    const adjustedTheme = theme === "light" ? "white" : theme;

    const fileName = `cursor-${size}-${color}.png`;

    return (
        <BaseButton
            onClick={onClick}
            color={adjustedTheme}
            aria-label={`커서 변경 버튼: ${size}, ${color}`}
        >
            <img
                src={getExtensionUrl(fileName)}
                alt={`커서: ${size}, ${color}`}
                className="group-hover:opacity-20"
            />
        </BaseButton>
    );
}
