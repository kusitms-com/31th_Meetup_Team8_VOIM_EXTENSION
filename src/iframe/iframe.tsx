import React, { useEffect, useState } from "react";
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
import { Sidebar } from "@src/components/sidebar";
import "../css/app.css";
import { useUserInfo } from "@src/hooks/useUserInfo";
import { FloatingButtonSide } from "@src/components/floatingButtonSide";

const menuItems = [
    { id: "high-contrast", text: "고대비 화면 사용하기" },
    { id: "font", text: "글자 설정하기" },
    { id: "shortcut", text: "단축키 안내 보기" },
    { id: "my-info", text: "내 정보 설정하기" },
    { id: "service", text: "서비스 설정하기" },
];
interface PanelContentProps {
    menuId: string | null;
}
import { useUserInfo } from "@src/hooks/useUserInfo";
import { useModalManagement } from "@src/hooks/useModalManagement";
import { PanelContent } from "@src/components/panelContent/component";
import { Onboarding } from "@src/tabs/myInfo/components";
import { MyInfo } from "@src/tabs/myInfo";
import { menuItems } from "@src/constants/menuItems";

import "../css/app.css";

const App: React.FC = () => {
    const {
        isModalOpen,
        setIsModalOpen,
        selectedMenu,
        lastSelectedMenuRef,
        menuButtonRefs,
        handleMenuClick,
        toggleModal,
        setSelectedMenu,
    } = useModalManagement();

    const [isOnboarding, setIsOnboarding] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const { birthYear, gender, loading } = useUserInfo();

    useEffect(() => {
        if (selectedMenu === null && lastSelectedMenuRef.current) {
            const btn = menuButtonRefs.current[lastSelectedMenuRef.current];
            btn?.focus();
        }
    }, [selectedMenu, lastSelectedMenuRef]);

    switch (menuId) {
        case "high-contrast":
            return (
                <div
                    ref={panelRef}
                    tabIndex={-1}
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
                    tabIndex={-1}
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
                    tabIndex={-1}
                    role="tabpanel"
                    aria-label="단축키 안내"
                >
                    <ShortcutTab />
                </div>
            );
        case "my-info":
            return (
                <div
                    ref={panelRef}
                    tabIndex={-1}
                    role="tabpanel"
                    aria-label="내 정보 설정"
                >
                    <MyInfo />
                </div>
            );
        case "service":
            return (
                <div
                    ref={panelRef}
                    tabIndex={-1}
                    role="tabpanel"
                    aria-label="서비스 설정"
                >
                    <ControlService />
                </div>
            );
        default:
            return null;
    }
};
const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { birthYear, gender, loading } = useUserInfo();
    const [categoryType, setCategoryType] = useState<
        "food" | "cosmetic" | "health" | null
    >(null);

    useEffect(() => {
        chrome.storage.local.get("voim-category-type", (res) => {
            if (res["voim-category-type"]) {
                setCategoryType(res["voim-category-type"]);
                console.log(
                    "[voim] storage로부터 감지된 카테고리 타입:",
                    res["voim-category-type"],
                );
            }
        });
    }, []);
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedMenu !== null) {
                setSelectedMenu(null);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectedMenu, setSelectedMenu]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "TOGGLE_MODAL") {
                toggleModal();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [toggleModal]);

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

    const openModal = () => {
        setIsModalOpen(true);
        window.parent.postMessage({ type: "RESIZE_IFRAME", isOpen: true }, "*");
    };

    const toggleModal = () => {
        const newState = !isModalOpen;
        setIsModalOpen(newState);
        if (!newState) {
            setSelectedMenu(null);
            setIsOnboarding(false);
        }
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: newState },
            "*",
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMenu(null);
        setIsOnboarding(false);
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: false },
            "*",
        );
    };

    const openSidebar = () => {
        setIsSidebarOpen(true);
        window.parent.postMessage({ type: "RESIZE_IFRAME", isOpen: true }, "*");
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: false },
            "*",
        );
    };

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
    };

    const handleMenuClick = (menuId: string) => {
        setSelectedMenu(menuId === selectedMenu ? null : menuId);
    };
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

    const handleMenuKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        id: string,
    ) => {
        if (e.key === "Tab" && !e.shiftKey && id === "service") {
            e.preventDefault();
            const menubarContainer = document.querySelector(
                '[data-testid="menubar-container"]',
            );

            if (menubarContainer) {
                const resetButton = menubarContainer.querySelector(
                    '[data-testid="reset-button"]',
                ) as HTMLButtonElement;

        const handleMessage = (event: MessageEvent) => {
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
                if (resetButton) {
                    resetButton.focus();
                    resetButton.setAttribute("tabIndex", "0");
                }
            }
        }
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
            {!isModalOpen && <FloatingButton onClick={openModal} />}
            {!isModalOpen && <FloatingButtonSide onClick={openSidebar} />}

            <Menubar isOpen={isModalOpen} onClose={closeModal}>
                {menuItems.map((item) => (
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
                        onKeyDown={(e) => handleMenuKeyDown(e, id)}
                        ariaLabel={`${text}`}
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

            {categoryType && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                    type={categoryType}
                />
            )}
        </div>
    );
};

export default App;
