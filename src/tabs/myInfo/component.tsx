import { useTheme } from "@src/contexts/ThemeContext";

export function MyInfo() {
    const { theme, fontClasses } = useTheme();
    const isDarkMode = theme === "dark";
    return;
}
