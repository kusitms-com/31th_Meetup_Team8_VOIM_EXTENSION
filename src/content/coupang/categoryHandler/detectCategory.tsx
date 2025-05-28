export const detectCategoryType = (): Promise<
    "food" | "cosmetic" | "health" | null
> => {
    return new Promise((resolve) => {
        console.log("[voim] 카테고리 감지 시작");

        const detect = () => {
            const breadcrumbEl = document.querySelector(
                ".breadcrumb, #breadcrumb",
            );

            if (!breadcrumbEl) {
                console.log("[voim] breadcrumb 요소가 아직 존재하지 않음");
                return null;
            }

            const rawText = breadcrumbEl.textContent || "";
            const cleanedText = rawText.replace(/\s+/g, "");
            console.log("[voim] breadcrumb 텍스트:", cleanedText);

            if (
                cleanedText.includes("식품") &&
                !cleanedText.includes("건강식품")
            ) {
                console.log("[voim] 감지된 카테고리: food");
                return "food";
            }
            if (cleanedText.includes("뷰티")) {
                console.log("[voim] 감지된 카테고리: cosmetic");
                return "cosmetic";
            }
            if (
                cleanedText.includes("건강") &&
                !cleanedText.includes("건강가전") &&
                !cleanedText.includes("건강도서")
            ) {
                console.log("[voim] 감지된 카테고리: health");
                return "health";
            }

            console.log("[voim] 감지된 카테고리 없음");
            return null;
        };

        const found = detect();
        if (found) {
            resolve(found);
            return;
        }

        const observer = new MutationObserver(() => {
            const result = detect();
            if (result) {
                console.log("[voim] MutationObserver 통해 감지 성공:", result);
                observer.disconnect();
                resolve(result);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            console.warn("[voim] 10초 안에 breadcrumb을 감지하지 못함");
            observer.disconnect();
            resolve(null);
        }, 10000);
    });
};
