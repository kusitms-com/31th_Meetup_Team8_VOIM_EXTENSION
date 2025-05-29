export const detectCategoryType = (): Promise<
    "food" | "cosmetic" | "health" | null
> => {
    console.log("[voim] 카테고리 감지 시작");

    return new Promise((resolve) => {
        const detect = () => {
            const el = document.querySelector(".breadcrumb, #breadcrumb");
            if (!el) return null;

            const text = (el.textContent || "").replace(/\s+/g, "");
            console.log("[voim] breadcrumb 텍스트:", text);

            if (text.includes("식품") && !text.includes("건강식품"))
                return "food";
            if (text.includes("뷰티")) return "cosmetic";
            if (
                text.includes("건강") &&
                !text.includes("건강가전") &&
                !text.includes("건강도서")
            )
                return "health";
            return null;
        };

        const result = detect();
        if (result) {
            resolve(result);
            return;
        }

        const observer = new MutationObserver(() => {
            const found = detect();
            if (found) {
                console.log("[voim] MutationObserver 통해 감지됨:", found);
                observer.disconnect();
                resolve(found);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            console.warn("[voim] 카테고리 감지 실패 (타임아웃)");
            observer.disconnect();
            resolve(null);
        }, 3000);
    });
};
