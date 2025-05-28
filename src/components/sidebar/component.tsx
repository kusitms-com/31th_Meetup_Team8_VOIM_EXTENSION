import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@src/contexts/ThemeContext";
import { CloseButton } from "../closeButton/component";
import { InfoComponent } from "@src/components/productComponents/infoComponent";
import { observeBreadcrumbFoodAndRender } from "@src/content/coupang/categoryHandler/categoryHandlerFood";
import { observeBreadcrumbCosmeticAndRender } from "@src/content/coupang/categoryHandler/categoryHandlerCosmetic";
import { HealthComponent } from "@src/components/productComponents/healthComponent";
import { ReviewSummaryComponent } from "../productComponents/ReviewSummaryComponent";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "food" | "cosmetic" | "health" | null;
}

const tabs = [
    { id: "ingredient", label: "성분 안내" },
    { id: "detail", label: "상세 정보" },
    { id: "review", label: "리뷰" },
] as const;

interface ReviewSummary {
    totalCount: number;
    averageRating: number;
    positiveReviews: string[];
    negativeReviews: string[];
    keywords: string[];
}

export function Sidebar({ isOpen, onClose, type }: ModalProps) {
    const { theme } = useTheme();
    const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]["id"]>(
        type ? "ingredient" : "detail",
    );
    const isDarkMode = theme === "dark";
    const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(
        null,
    );

    useEffect(() => {
        setSelectedTab(type ? "ingredient" : "detail");
    }, [type]);

    const foodMountRef = useRef<HTMLDivElement>(null);
    const cosmeticMountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && selectedTab === "ingredient" && type) {
            if (type === "food" && foodMountRef.current) {
                observeBreadcrumbFoodAndRender(foodMountRef.current);
            }
            if (type === "cosmetic" && cosmeticMountRef.current) {
                observeBreadcrumbCosmeticAndRender(cosmeticMountRef.current);
            }
        }
    }, [isOpen, selectedTab, type]);

    useEffect(() => {
        // 리뷰 요약 데이터 수신
        const handleMessage = (message: any) => {
            if (message.type === "REVIEW_SUMMARY_RESPONSE") {
                setReviewSummary(message.data);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        // 현재 탭의 productId 가져오기
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (currentTab?.url?.includes("/products/")) {
                const productId =
                    currentTab.url.match(/\/products\/(\d+)/)?.[1];
                if (productId) {
                    // 저장된 리뷰 요약 데이터 확인
                    chrome.storage.local.get(
                        [`review_summary_${productId}`],
                        (result) => {
                            const savedSummary =
                                result[`review_summary_${productId}`];
                            if (savedSummary) {
                                setReviewSummary(savedSummary);
                            }
                        },
                    );
                }
            }
        });

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;
        onClose();
    };

    const renderContent = () => {
        switch (selectedTab) {
            case "ingredient":
                if (!type) return null;
                switch (type) {
                    case "food":
                        return <div ref={foodMountRef} className="w-full" />;
                    case "cosmetic":
                        return (
                            <div ref={cosmeticMountRef} className="w-full" />
                        );
                    case "health":
                        return <HealthComponent />;
                    default:
                        return null;
                }
            case "detail":
                return <InfoComponent />;
            case "review":
                return (
                    <ReviewSummaryComponent
                        summary={
                            reviewSummary || {
                                totalCount: 0,
                                averageRating: 0,
                                positiveReviews: [],
                                negativeReviews: [],
                                keywords: [],
                            }
                        }
                    />
                );
            default:
                return (
                    <p className="text-grayscale-500">
                        아직 구현되지 않은 탭입니다.
                    </p>
                );
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-[10000] bg-black/30 backdrop-blur-[5px] transition-opacity duration-200 ${
                isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }`}
            onClick={handleOverlayClick}
            data-testid="sidebar-overlay"
        >
            <div
                className={`${
                    isDarkMode ? "bg-grayscale-900" : "bg-grayscale-100"
                } fixed top-0 right-0 w-[50%] h-full p-5 overflow-y-auto shadow-[0_0_4px_rgba(0,0,0,0.25)] font-koddi`}
                data-testid="menubar-container"
            >
                <div className="flex justify-between items-center mb-6 font-24-Bold">
                    <div className="flex gap-6">
                        {tabs.map((tab) => {
                            if (!type && tab.id === "ingredient") return null;
                            return (
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
                            );
                        })}
                    </div>
                    <CloseButton onClick={onClose} />
                </div>

                <div
                    className="flex flex-col gap-5"
                    data-testid="menubar-content"
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
