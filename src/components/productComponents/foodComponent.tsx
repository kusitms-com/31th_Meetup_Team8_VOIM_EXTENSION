import React, { useEffect, useState } from "react";
import { sendFoodDataRequest } from "../../content/apiSetting/sendFoodDataRequest";

interface Nutrient {
    nutrientType: string;
    percentage: number;
}

export const FoodComponent = () => {
    const [nutrientAlerts, setNutrientAlerts] = useState<Nutrient[] | null>(
        null,
    );
    const [allergyTypes, setAllergyTypes] = useState<string[] | null>(null);
    const [nutrientOpen, setNutrientOpen] = useState(false);
    const [allergyOpen, setAllergyOpen] = useState(false);

    useEffect(() => {
        const waitForVendorItem = () => {
            const observer = new MutationObserver(() => {
                const vendorEl = document.querySelector(".vendor-item");
                if (vendorEl) {
                    console.log("[voim] .vendor-item 등장 감지 ");
                    observer.disconnect();
                    fetchNutrientData(vendorEl);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            console.log("[voim] .vendor-item 등장 대기 중");
        };

        const fetchNutrientData = async (vendorEl: Element) => {
            const { birthYear, gender } = await chrome.storage.local.get([
                "birthYear",
                "gender",
            ]);

            if (!birthYear || !gender) {
                console.warn("birthYear 또는 gender가 없습니다.");
                return;
            }

            const match = window.location.href.match(/products\/(\d+)/);
            const productId = match ? match[1] : null;
            if (!productId) {
                console.warn("productId를 추출하지 못했습니다.");
                return;
            }

            const rawHtml = vendorEl.outerHTML;
            const formattedHtml = rawHtml
                .replace(/src=\"https?:\/\/([^\"]+)\"/g, 'src="//$1"')
                .replace(
                    /src=\"image11\.coupangcdn\.com/g,
                    'src="//image11.coupangcdn.com',
                )
                .replace(/\sonerror=\"[^\"]*\"/g, "")
                .replace(/\"/g, '\\"')
                .replace(/\n/g, "")
                .trim();

            const payload = {
                productId,
                title: document.title,
                html: formattedHtml,
                birthYear: Number(birthYear),
                gender: gender.toUpperCase(),
                allergies: [],
            };

            try {
                const res = await sendFoodDataRequest(payload);
                console.log("[voim] FOOD API 응답:", res);

                if (res) {
                    setNutrientAlerts(res.overRecommendationNutrients || []);
                    setAllergyTypes(res.allergyTypes || []);
                } else {
                    console.warn("[voim] 응답이 undefined입니다.");
                }
            } catch (error) {
                console.error("[voim] FOOD API 요청 실패:", error);
            }
        };

        waitForVendorItem();
    }, []);

    if (nutrientAlerts === null || allergyTypes === null) {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: "white",
                    border: "2px solid #8914FF",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    zIndex: 9999,
                    width: "360px",
                    fontFamily: "KoddiUDOnGothic, sans-serif",
                    color: "#555",
                    fontSize: "16px",
                    textAlign: "center",
                }}
            >
                제품 정보를 분석 중입니다...
            </div>
        );
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                backgroundColor: "white",
                border: "2px solid #8914FF",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                zIndex: 9999,
                width: "360px",
                fontFamily: "KoddiUDOnGothic, sans-serif",
            }}
        >
            <p
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                    color: "#000",
                }}
            >
                [식품] 영양성분 하루 기준치 초과 주의
            </p>
            <p
                style={{
                    fontSize: "14px",
                    color: "#6C6E73",
                    marginBottom: "16px",
                }}
            >
                하루 기준 섭취량의 40%를 넘는 영양성분이 {nutrientAlerts.length}
                가지 들어 있습니다. 섭취 시 참고해주세요.
            </p>

            <button
                style={{
                    width: "100%",
                    padding: "12px 0",
                    backgroundColor: "#8914FF",
                    color: "white",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: nutrientOpen ? "8px" : "16px",
                    border: "none",
                    cursor: "pointer",
                }}
                onClick={() => setNutrientOpen(!nutrientOpen)}
            >
                {nutrientOpen ? "전체 보기 닫기" : "전체 보기 열기"}
            </button>

            {nutrientOpen && (
                <ul
                    style={{
                        marginBottom: "16px",
                        color: "#505156",
                        backgroundColor: "#F5F7FB",
                        borderRadius: "12px",
                        padding: "16px",
                    }}
                >
                    {nutrientAlerts.map((item, idx) => (
                        <li
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                                fontSize: "16px",
                                fontWeight: 600,
                            }}
                        >
                            <span>{item.nutrientType}</span>
                            <span>{item.percentage}%</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
