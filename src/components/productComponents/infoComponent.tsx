import React, { useState } from "react";
import { sendOutlineInfoRequest } from "../../content/apiSetting/sendInfoRequest";
import { BaseFillButton } from "../baseFillButton/component";
import { BaseButton } from "../baseButton/component";
import { useTheme } from "@src/contexts/ThemeContext";

type OutlineCategory = "MAIN" | "USAGE" | "WARNING" | "SPECS" | "CERTIFICATION";

const OUTLINE_CATEGORIES = [
    { key: "MAIN", label: "주요 성분" },
    { key: "USAGE", label: "사용 방법 및 대상" },
    { key: "WARNING", label: "주의 및 보관" },
    { key: "SPECS", label: "규격 및 옵션" },
    { key: "CERTIFICATION", label: "인증 및 기타" },
] as const;

export const InfoComponent = () => {
    const { theme, fontClasses } = useTheme();
    const isDarkMode = theme === "dark";

    const [selected, setSelected] = useState<OutlineCategory | null>(null);
    const [info, setInfo] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const fetchVendorHtml = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    type: "FETCH_VENDOR_HTML",
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error(
                            "HTML 요청 실패:",
                            chrome.runtime.lastError.message,
                        );
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response?.html ?? "");
                    }
                },
            );
        });
    };

    const handleClick = async (outline: OutlineCategory) => {
        if (selected === outline) {
            setSelected(null);
            return;
        }

        setSelected(outline);
        setLoading(true);

        try {
            const html = await fetchVendorHtml();
            const result = await sendOutlineInfoRequest(outline, html);
            setInfo(result || "정보가 없습니다.");
        } catch (error) {
            console.error("[voim] INFO 요청 실패:", error);
            setInfo("정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            {OUTLINE_CATEGORIES.map(({ key, label }) => (
                <div key={key}>
                    {selected === key ? (
                        <div>
                            <BaseFillButton onClick={() => setSelected(null)}>
                                {label} 닫기
                            </BaseFillButton>
                            <div
                                className={`mt-7 ${fontClasses.fontCommon} ${
                                    isDarkMode
                                        ? `text-grayscale-100`
                                        : `text-grayscale-900`
                                }`}
                            >
                                {loading ? (
                                    "불러오는 중..."
                                ) : (
                                    <ul className="pl-6 space-y-2 list-disc">
                                        {info.split("\n").map(
                                            (item, index) =>
                                                item.trim() && (
                                                    <li
                                                        key={index}
                                                        className="leading-relaxed"
                                                    >
                                                        {item.trim()}
                                                    </li>
                                                ),
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="my-7">
                            <BaseButton
                                isFull={true}
                                onClick={() => handleClick(key)}
                            >
                                {label}
                            </BaseButton>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
