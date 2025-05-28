import React, { useState } from "react";
import { sendOutlineInfoRequest } from "../../content/apiSetting/sendInfoRequest";

type OutlineCategory = "MAIN" | "USAGE" | "WARNING" | "SPECS" | "CERTIFICATION";

const OUTLINE_CATEGORIES = [
    { key: "MAIN", label: "주요 정보" },
    { key: "USAGE", label: "사용 방법 및 대상" },
    { key: "WARNING", label: "주의 및 보관" },
    { key: "SPECS", label: "규격 및 옵션" },
    { key: "CERTIFICATION", label: "인증 및 기타" },
] as const;

export const InfoComponent = () => {
    const [selected, setSelected] = useState<OutlineCategory | null>(null);
    const [info, setInfo] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const commonTextStyle: React.CSSProperties = {
        fontFamily: "KoddiUD OnGothic",
        fontSize: "28px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "150%",
        textAlign: "center",
    };
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
        <div
            style={{
                padding: "24px",
                border: "none",
                width: "100%",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                fontFamily: "KoddiUDOnGothic",
                zIndex: 1,
            }}
        >
            {OUTLINE_CATEGORIES.map(({ key, label }) => (
                <div
                    key={key}
                    style={{
                        width: "96%",
                        padding: "16px",
                        backgroundColor: "#FEFEFE",
                        marginBottom: "5px",
                        fontWeight: 700,
                        fontSize: "24px",
                        fontFamily: "KoddiUD OnGothic",
                        textAlign: "center",
                    }}
                >
                    {selected === key && (
                        <>
                            <div
                                style={{
                                    ...commonTextStyle,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {loading ? "불러오는 중..." : info}
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#8914FF",
                                    color: "white",
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    border: "none",
                                    padding: "12px 0",
                                    borderRadius: "12px",
                                    marginBottom: "16px",
                                    cursor: "pointer",
                                    marginTop: "20px",
                                }}
                            >
                                닫기
                            </button>
                        </>
                    )}
                    <div
                        onClick={() => handleClick(key)}
                        style={{
                            width: "96%",
                            padding: "16px",
                            backgroundColor: "#FEFEFE",
                            borderRadius: "14px",
                            fontWeight: 700,
                            fontSize: "24px",
                            fontFamily: "KoddiUD OnGothic",
                            marginBottom: "12px",
                            cursor: "pointer",
                            textAlign: "center",
                            border: "4px solid #EAEDF4",
                        }}
                    >
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
};
