import React, { useEffect, useState } from "react";

interface NutrientAlert {
    name: string;
    percent: number;
}
function escapeHtml(html: string): string {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export const FoodComponent = () => {
    const [nutrientAlerts, setNutrientAlerts] = useState<
        NutrientAlert[] | null
    >(null);

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
            console.log("[voim] 전송할 HTML:", formattedHtml);

            const payload = {
                productId,
                title: document.title,
                html: formattedHtml,
                birthYear: Number(birthYear),
                gender: gender.toUpperCase(),
                allergies: [],
            };

            chrome.runtime.sendMessage({ type: "FETCH_FOOD_DATA", payload });
        };

        waitForVendorItem();
    }, []);

    if (!nutrientAlerts) return null;

    const allergyCount = 2;

    return (
        <div className="fixed bottom-5 right-5 bg-white border-2 border-purple-default rounded-2xl p-6 shadow-lg z-[9999] w-[360px] font-koddi">
            <p className="text-black text-[18px] font-bold mb-1">
                [식품] 영양 및 알레르기 성분 안내
            </p>
            <p className="text-grayscale-700 text-[14px] mb-4">
                섭취 시 참고해주세요.
            </p>

            <div className="border-t border-grayscale-300 my-2"></div>

            <div className="flex justify-between text-[16px] font-bold text-grayscale-800 mb-2">
                <span>하루 기준 섭취량의 40% 넘는 영양성분</span>
                <span>총 {nutrientAlerts.length}개</span>
            </div>

            <button className="w-full py-3 text-white bg-purple-default rounded-xl font-bold text-[16px] mb-4">
                주의 성분 전체 보기
            </button>

            <div className="flex justify-between text-[16px] font-bold text-grayscale-800 mb-2">
                <span>알레르기 유발 식품</span>
                <span>총 {allergyCount}개</span>
            </div>

            <button className="w-full py-3 text-white bg-purple-default rounded-xl font-bold text-[16px]">
                알레르기 유발 식품 전체 보기
            </button>
        </div>
    );
};
