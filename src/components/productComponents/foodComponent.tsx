import React, { useEffect, useState } from "react";

export const FoodComponent = () => {
    const [nutrientAlerts, setNutrientAlerts] = useState<string[]>([]);
    const [allergyTypes, setAllergyTypes] = useState<string[]>([]);
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
                .replace(/src="https?:\/\/([^"]+)"/g, 'src="//$1"')
                .replace(
                    /src="image11\.coupangcdn\.com/g,
                    'src="//image11.coupangcdn.com',
                )
                .replace(/\sonerror="[^"]*"/g, "")
                .replace(/"/g, '\\"')
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

            chrome.runtime.sendMessage(
                { type: "FETCH_FOOD_DATA", payload },
                (res) => {
                    if (res?.status === 200) {
                        console.log(
                            "[voim][background] FOOD API 응답 성공:",
                            res,
                        );
                        setNutrientAlerts(
                            res.data.overRecommendationNutrients || [],
                        );
                        setAllergyTypes(res.data.allergyTypes || []);
                    } else {
                        console.warn("[voim] FOOD API 에러:", res);
                    }
                },
            );
        };

        waitForVendorItem();
    }, []);

    if (nutrientAlerts.length === 0 && allergyTypes.length === 0) return null;

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
                [식품] 영양 및 알레르기 성분 안내
            </p>
            <p
                style={{
                    fontSize: "14px",
                    color: "#6C6E73",
                    marginBottom: "16px",
                }}
            >
                섭취 시 참고해주세요.
            </p>

            <div
                style={{
                    borderTop: "1px solid #EAEDF4",
                    marginTop: "8px",
                    marginBottom: "8px",
                }}
            ></div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#323335",
                    marginBottom: "8px",
                }}
            >
                <span>하루 기준 섭취량의 40% 넘는 영양성분</span>
                <span>총 {nutrientAlerts.length}개</span>
            </div>

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
                {nutrientOpen ? "전체 보기 닫기" : "주의 성분 전체 보기"}
            </button>

            {nutrientOpen && (
                <ul
                    style={{
                        marginBottom: "16px",
                        paddingLeft: "16px",
                        color: "#505156",
                    }}
                >
                    {nutrientAlerts.map((name) => (
                        <li key={name}>- {name}</li>
                    ))}
                </ul>
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#323335",
                    marginBottom: "8px",
                }}
            >
                <span>알레르기 유발 식품</span>
                <span>총 {allergyTypes.length}개</span>
            </div>

            <button
                style={{
                    width: "100%",
                    padding: "12px 0",
                    backgroundColor: "#8914FF",
                    color: "white",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: allergyOpen ? "8px" : "0px",
                    border: "none",
                    cursor: "pointer",
                }}
                onClick={() => setAllergyOpen(!allergyOpen)}
            >
                {allergyOpen
                    ? "전체 보기 닫기"
                    : "알레르기 유발 식품 전체 보기"}
            </button>

            {allergyOpen && (
                <ul
                    style={{
                        marginTop: "12px",
                        paddingLeft: "16px",
                        color: "#505156",
                    }}
                >
                    {allergyTypes.map((name) => (
                        <li key={name}>- {name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
