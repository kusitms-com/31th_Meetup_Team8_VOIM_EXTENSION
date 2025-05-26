import React, { useEffect, useRef, useState, useCallback } from "react";

import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menubar";
import { MenubarButton } from "@src/components/menubarButton";
import { useTheme } from "@src/contexts/ThemeContext";
import { ShortcutTab } from "@src/components/shortcutTab";
import ControlMode from "@src/components/modeButton/ControlMode";
import ControlFont from "@src/components/fontButton/ControlFont";
import { MyInfo } from "@src/tabs/myInfo";
import ControlService from "@src/components/serviceButton/ControlService";
import { Onboarding } from "@src/tabs/myInfo/components";

import "../css/app.css";
import { useUserInfo } from "@src/hooks/useUserInfo";

interface PanelContentProps {
    menuId: string | null;
}

const PanelContent: React.FC<PanelContentProps> = ({ menuId }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLElement | null>(null);
    const lastFocusableRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (menuId && panelRef.current) {
            panelRef.current.focus();

            const focusableElements = panelRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );

            if (focusableElements.length > 0) {
                firstFocusableRef.current = focusableElements[0] as HTMLElement;
                lastFocusableRef.current = focusableElements[
                    focusableElements.length - 1
                ] as HTMLElement;

                firstFocusableRef.current.focus();
            }

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Tab") {
                    if (e.shiftKey) {
                        if (
                            document.activeElement === firstFocusableRef.current
                        ) {
                            e.preventDefault();

                            const menuButtons = document.querySelectorAll(
                                '[data-testid="menubar-content"] button',
                            );
                            const currentMenuButton = Array.from(
                                menuButtons,
                            ).find((button) =>
                                button
                                    .getAttribute("aria-label")
                                    ?.includes(menuId || ""),
                            );
                            if (currentMenuButton) {
                                (currentMenuButton as HTMLElement).focus();
                            }
                        }
                    } else {
                        if (
                            document.activeElement === lastFocusableRef.current
                        ) {
                            e.preventDefault();

                            const menuButtons = document.querySelectorAll(
                                '[data-testid="menubar-content"] button',
                            );
                            const currentIndex = menuItems.findIndex(
                                (item) => item.id === menuId,
                            );
                            if (currentIndex !== -1) {
                                if (currentIndex < menuItems.length - 1) {
                                    const nextButton = menuButtons[
                                        currentIndex + 1
                                    ] as HTMLElement;
                                    if (nextButton) {
                                        nextButton.focus();
                                    }
                                } else {
                                    const firstButton =
                                        menuButtons[0] as HTMLElement;
                                    if (firstButton) {
                                        firstButton.focus();
                                    }
                                }
                            }
                        }
                    }
                }
            };

            panelRef.current.addEventListener("keydown", handleKeyDown);
            return () => {
                panelRef.current?.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [menuId]);

    switch (menuId) {
        case "high-contrast":
            return (
                <div
                    ref={panelRef}
                    tabIndex={0}
                    role="tabpanel"
                    aria-label="고대비 화면 설정"
                >
                    <ControlMode />
                </div>
            );

        case "font":
            return (
                <div
                    ref={panelRef}
                    tabIndex={0}
                    role="tabpanel"
                    aria-label="글자 설정"
                >
                    <ControlFont />
                </div>
            );

        case "shortcut":
            return (
                <div
                    ref={panelRef}
                    tabIndex={0}
                    role="tabpanel"
                    aria-label="단축키 안내 보기"
                >
                    <ShortcutTab />
                </div>
            );

        case "my-info":
            return (
                <div
                    ref={panelRef}
                    tabIndex={0}
                    role="tabpanel"
                    aria-label="내 정보 설정하기"
                >
                    <MyInfo />
                </div>
            );

        case "service":
            return (
                <div
                    ref={panelRef}
                    tabIndex={0}
                    role="tabpanel"
                    aria-label="서비스 설정하기"
                >
                    <ControlService />
                </div>
            );

        default:
            return null;
    }
};

const menuItems = [
    { id: "high-contrast", text: "고대비 화면 사용하기" },
    { id: "font", text: "글자 설정하기" },
    { id: "shortcut", text: "단축키 안내 보기" },
    { id: "my-info", text: "내 정보 설정하기" },
    { id: "service", text: "서비스 설정하기" },
];

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const lastSelectedMenuRef = useRef<string | null>(null);
    const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const { birthYear, gender, loading } = useUserInfo();

    useEffect(() => {
        if (selectedMenu === null && lastSelectedMenuRef.current) {
            const btn = menuButtonRefs.current[lastSelectedMenuRef.current];
            btn?.focus();
        }
    }, [selectedMenu]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedMenu !== null) {
                setSelectedMenu(null);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectedMenu]);

    useEffect(() => {
        if (isModalOpen) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Tab" && !e.shiftKey) {
                    const menuButtons = document.querySelectorAll(
                        '[data-testid="menubar-content"] button',
                    );
                    const currentButton = document.activeElement;
                    const currentIndex = Array.from(menuButtons).indexOf(
                        currentButton as Element,
                    );

                    if (currentIndex === menuItems.length - 1) {
                        e.preventDefault();
                        const resetButton = document.querySelector(
                            '[data-testid="menubar-container"] button',
                        ) as HTMLElement;
                        if (resetButton) {
                            resetButton.focus();
                        }
                    }
                }
            };

            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isModalOpen]);

    useEffect(() => {
        chrome.storage.local.get(["isFirstInstall"], (result) => {
            if (result.isFirstInstall === undefined) {
                chrome.storage.local.set({ isFirstInstall: true });
                setIsOnboarding(true);
                window.parent.postMessage(
                    { type: "RESIZE_IFRAME", isOpen: true },
                    "*",
                );
            } else if (!birthYear && !gender && !loading) {
                setIsOnboarding(true);
                window.parent.postMessage(
                    { type: "RESIZE_IFRAME", isOpen: true },
                    "*",
                );
            }
        });
    }, [birthYear, gender, loading]);

    const handleMenuClick = useCallback(
        (menuId: string) => {
            if (menuId === selectedMenu) {
                setSelectedMenu(null);
            } else {
                setSelectedMenu(menuId);
                lastSelectedMenuRef.current = menuId;

                setTimeout(() => {
                    const panel = document.querySelector('[role="tabpanel"]');
                    if (panel) {
                        (panel as HTMLElement).focus();
                    }
                }, 0);
            }
        },
        [selectedMenu],
    );

    const toggleModal = useCallback(() => {
        setIsModalOpen((prev) => {
            const newState = !prev;

            if (!newState) {
                setSelectedMenu(null);
                setIsOnboarding(false);
            }

            window.parent.postMessage(
                { type: "RESIZE_IFRAME", isOpen: newState },
                "*",
            );

            return newState;
        });
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data || typeof event.data.type !== "string") return;

            switch (event.data.type) {
                case "TOGGLE_MODAL":
                    toggleModal();
                    break;
                case "HIDE_LOGO":
                    document.getElementById("logo")?.classList.add("hidden");
                    chrome.storage.local.set({ "logo-hidden": true });
                    break;
                case "SHOW_LOGO":
                    document.getElementById("logo")?.classList.remove("hidden");
                    chrome.storage.local.set({ "logo-hidden": false });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [toggleModal]);

    useEffect(() => {
        chrome.storage.local.get("logo-hidden", (res) => {
            if (res["logo-hidden"]) {
                document.getElementById("logo")?.classList.add("hidden");
            }
        });
    }, []);

    const handleOnboardingComplete = () => {
        setIsOnboarding(false);
        setShowUserInfo(true);
        chrome.storage.local.set({ isFirstInstall: false });
    };

    const handleUserInfoComplete = () => {
        setShowUserInfo(false);
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: false },
            "*",
        );

        setTimeout(() => {
            const menuButtons = document.querySelectorAll(
                '[data-testid="menubar-content"] button',
            );
            const myInfoButton = Array.from(menuButtons).find((button) =>
                button.getAttribute("aria-label")?.includes("내 정보 설정하기"),
            );
            if (myInfoButton) {
                (myInfoButton as HTMLElement).focus();
            }
        }, 0);
    };

    if (isOnboarding) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                <Onboarding onComplete={handleOnboardingComplete} />
            </div>
        );
    }

    if (showUserInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                <MyInfo onComplete={handleUserInfoComplete} />
            </div>
        );
    }

    return (
        <div className="pointer-events-auto">
            {!isModalOpen && <FloatingButton onClick={toggleModal} />}

            <Menubar
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    window.parent.postMessage(
                        { type: "RESIZE_IFRAME", isOpen: false },
                        "*",
                    );
                }}
            >
                {menuItems.map(({ id, text }) => (
                    <MenubarButton
                        key={id}
                        isSelected={selectedMenu === id}
                        text={text}
                        onClick={() => handleMenuClick(id)}
                        ariaLabel={`${text} 선택`}
                        ref={(el) => (menuButtonRefs.current[id] = el)}
                    />
                ))}

                <div
                    className={`fixed right-[500px] top-[70px] bg-none overflow-y-auto transition-transform duration-300 z-[10000] ${
                        isModalOpen && selectedMenu !== null ? "flex" : "hidden"
                    }`}
                >
                    <PanelContent menuId={selectedMenu} />
                </div>
            </Menubar>
        </div>
    );
};

export default App;
