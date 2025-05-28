import React, { useEffect, useState } from "react";
import { FloatingButton } from "@src/components/floatingButton";
import { Menubar } from "@src/components/menubar";
import { MenubarButton } from "@src/components/menubarButton";
import { MyInfo } from "@src/tabs/myInfo";
import { Onboarding } from "@src/tabs/myInfo/components";
import { Sidebar } from "@src/components/sidebar";
import "../css/app.css";
import { useUserInfo } from "@src/hooks/useUserInfo";
import { FloatingButtonSide } from "@src/components/floatingButtonSide";
import { useModalManagement } from "@src/hooks/useModalManagement";
import { PanelContent } from "@src/components/panelContent/component";
import { menuItems } from "@src/constants/menuItems";

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { birthYear, gender, loading } = useUserInfo();
    const [categoryType, setCategoryType] = useState<
        "food" | "cosmetic" | "health" | null
    >(null);
    const [isDetailPage, setIsDetailPage] = useState(false);
    const [isCartPage, setIsCartPage] = useState(false);

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setIsModalOpen(false);
        window.parent.postMessage(
            { type: "RESIZE_IFRAME", isOpen: false },
            "*",
        );
    };

    const openSidebar = () => {
        setIsSidebarOpen(true);
        setIsModalOpen(false);
        window.parent.postMessage({ type: "RESIZE_IFRAME", isOpen: true }, "*");
    };

    useEffect(() => {
        if (selectedMenu === null && lastSelectedMenuRef.current) {
            const btn = menuButtonRefs.current[lastSelectedMenuRef.current];
            btn?.focus();
        }
    }, [selectedMenu, lastSelectedMenuRef]);

    useEffect(() => {
        chrome.storage.local.get("voim-category-type", (res) => {
            if (res["voim-category-type"]) {
                setCategoryType(res["voim-category-type"]);
            }
        });
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (selectedMenu !== null) {
                    setSelectedMenu(null);
                    return;
                }
                if (isSidebarOpen) {
                    closeSidebar();
                    window.parent.postMessage(
                        { type: "RESIZE_IFRAME", isOpen: false },
                        "*",
                    );
                    return;
                }
                if (isModalOpen) {
                    setIsModalOpen(false);
                    window.parent.postMessage(
                        { type: "RESIZE_IFRAME", isOpen: false },
                        "*",
                    );
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [
        selectedMenu,
        setSelectedMenu,
        isSidebarOpen,
        closeSidebar,
        isModalOpen,
    ]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data) {
                switch (event.data.type) {
                    case "TOGGLE_MODAL":
                        toggleModal();
                        break;
                    case "HIDE_LOGO":
                        document
                            .getElementById("logo")
                            ?.classList.add("hidden");
                        chrome.storage.local.set({ "logo-hidden": true });
                        break;
                    case "SHOW_LOGO":
                        document
                            .getElementById("logo")
                            ?.classList.remove("hidden");
                        chrome.storage.local.set({ "logo-hidden": false });
                        break;
                    case "PAGE_TYPE":
                        setIsDetailPage(Boolean(event.data.value));
                        break;
                    case "CART_PAGE":
                        setIsCartPage(Boolean(event.data.value));
                        break;
                    case "CLOSE_SIDEBAR":
                        closeSidebar();
                        break;
                    default:
                        break;
                }
            }
        };

        // 메시지 리스너 등록
        window.addEventListener("message", handleMessage);

        // 초기 페이지 타입 요청
        try {
            window.parent.postMessage({ type: "REQUEST_PAGE_TYPE" }, "*");
        } catch (error) {
            console.error("[voim] 페이지 타입 요청 실패:", error);
        }

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [toggleModal, closeSidebar]);

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
            {!isModalOpen && !isSidebarOpen && (
                <FloatingButton onClick={toggleModal} />
            )}
            {!isModalOpen && !isSidebarOpen && (isDetailPage || isCartPage) && (
                <FloatingButtonSide onClick={openSidebar} />
            )}

            <Menubar
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    window.parent.postMessage(
                        { type: "RESIZE_IFRAME", isOpen: false },
                        "*",
                    );
                }}
                role="menu"
                aria-label="VOIM 설정 메뉴"
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

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                type={categoryType}
            />
        </div>
    );
};

export default App;
