import { useEffect, useState } from "react";

export function useDarkMode() {
    const getDarkMode = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [isDarkMode, setIsDarkMode] = useState(getDarkMode);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isDarkMode;
}
