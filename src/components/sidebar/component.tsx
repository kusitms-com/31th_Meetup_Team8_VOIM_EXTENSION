import React, { useState } from "react";
import { useTheme } from "@src/contexts/ThemeContext";
import { CloseButton } from "../closeButton/component";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const tabs = [
    { id: "ingredient", label: "성분 안내" },
    { id: "detail", label: "상세 정보" },
    { id: "review", label: "리뷰" },
];

export function Sidebar({ isOpen, onClose, children }: ModalProps) {
    const { theme } = useTheme();
    const [selectedTab, setSelectedTab] = useState("ingredient");

    const isDarkMode = theme === "dark";

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = document.querySelector(
            '[data-testid="menubar-container"]',
        );
        if (container && !container.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[10000] bg-black/30 backdrop-blur-[5px] transition-opacity duration-200 ${
                isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }`}
            onClick={handleOverlayClick}
            data-testid="sidebar-overlay"
        >
            <div
                className={`${
                    isDarkMode ? `bg-grayscale-900` : `bg-grayscale-100`
                } fixed top-[70px] right-[20px] rounded-[30px] w-[460px] p-5 overflow-y-auto shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] font-koddi`}
                data-testid="menubar-container"
            >
                <div className="flex justify-between items-center mb-6 font-24-Bold">
                    <div className="flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`font-20-Bold ${
                                    selectedTab === tab.id
                                        ? "text-purple-default border-b-2 border-purple-default"
                                        : "text-grayscale-500"
                                } pb-1`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <CloseButton onClick={onClose} />
                </div>

                <div
                    className="flex flex-col gap-5"
                    data-testid="menubar-content"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
