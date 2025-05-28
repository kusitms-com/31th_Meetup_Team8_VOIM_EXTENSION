export const detectCategoryType = (): "food" | "cosmetic" | "health" | null => {
    const breadcrumbEl = document.querySelector(".breadcrumb");
    if (!breadcrumbEl) {
        console.log("[voim] breadcrumb 요소를 찾을 수 없습니다.");
        return null;
    }

    const rawText = breadcrumbEl.textContent || "";
    const cleanedText = rawText.replace(/\s+/g, "");

    console.log("[voim] breadcrumb 원본 텍스트:", rawText);
    console.log("[voim] 정제된 텍스트:", cleanedText);

    if (cleanedText.includes("식품") && !cleanedText.includes("건강식품")) {
        console.log("[voim] 감지된 카테고리: food");
        return "food";
    }

    if (cleanedText.includes("뷰티")) {
        console.log("[voim]  감지된 카테고리: cosmetic");
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

    console.log("[voim] 감지된 카테고리가 없음.");
    return null;
};
