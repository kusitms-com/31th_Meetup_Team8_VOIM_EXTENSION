import React, { useState } from "react";
import { BaseButton } from "@src/components/baseButton/component";
import { BaseFillButton } from "@src/components/baseFillButton/component";
import { LeftArrowIcon } from "@src/components/icons/LeftArrowIcon";
import { RightArrowIcon } from "@src/components/icons/RightArrowIcon";
import { IconButton } from "@src/components/IconButton";
import { useTheme } from "@src/contexts/ThemeContext";
import { ContentBox } from "@src/components/contentBox";
import { CloseIcon } from "@src/components/icons/CloseIcon";

const allergyData = {
    식물성: ["메밀", "대두", "밀", "땅콩", "잣", "호두", "토마토", "복숭아"],
    동물성: ["계란", "우유", "닭고기", "돼지고기", "쇠고기"],
    해산물: ["게", "새우", "오징어", "고등어", "조개류"],
    "첨가물 및 기타": ["아황산류"],
} as const;

type AllergyCategory = keyof typeof allergyData;

const ALL_CATEGORY = Object.keys(allergyData) as AllergyCategory[];

export function AllergySelectForm({ onComplete }: { onComplete?: () => void }) {
    const [selectedCategory, setSelectedCategory] = useState<AllergyCategory>(
        ALL_CATEGORY[0],
    );
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

    const changeCategory = (direction: "prev" | "next") => {
        const currentIndex = ALL_CATEGORY.indexOf(selectedCategory);
        let newIndex;
        if (direction === "prev") {
            newIndex =
                currentIndex === 0 ? ALL_CATEGORY.length - 1 : currentIndex - 1;
        } else {
            newIndex =
                currentIndex === ALL_CATEGORY.length - 1 ? 0 : currentIndex + 1;
        }
        setSelectedCategory(ALL_CATEGORY[newIndex]);
    };

    const toggleAllergy = (item: string) => {
        setSelectedAllergies((prev) =>
            prev.includes(item)
                ? prev.filter((a) => a !== item)
                : [...prev, item],
        );
    };

    return (
        <div className="w-[692px] min-h-[638px] max-h-[638px] flex-col flex justify-between overflow-y-auto">
            <div>
                <div className="mb-8">알러지 선택하기</div>
                <div className="flex items-center justify-center gap-4 mb-4">
                    <IconButton
                        onClick={() => changeCategory("prev")}
                        aria-label="이전 카테고리"
                    >
                        <LeftArrowIcon />
                    </IconButton>
                    <ContentBox>
                        <div className="w-full text-center">
                            {selectedCategory}
                        </div>
                    </ContentBox>
                    <IconButton
                        onClick={() => changeCategory("next")}
                        aria-label="다음 카테고리"
                    >
                        <RightArrowIcon />
                    </IconButton>
                </div>

                <div className="flex flex-wrap gap-[20px] mb-[20px]">
                    {allergyData[selectedCategory].map((item: string) => (
                        <BaseButton
                            key={item}
                            onClick={() => toggleAllergy(item)}
                            isSelected={selectedAllergies.includes(item)}
                            nonCheck={true}
                            aria-label={`${item}`}
                        >
                            {item}
                        </BaseButton>
                    ))}
                </div>
            </div>
            <div>
                <div className="mb-2">선택한 알러지 확인하기</div>

                <div className="p-2 flex flex-wrap gap-2 mb-[44px] rounded-[18px] min-h-[92px] bg-grayscale-200">
                    {selectedAllergies.map((item) => (
                        <BaseButton
                            nonCheck={true}
                            isSelected={selectedAllergies.includes(item)}
                            key={item}
                            onClick={() =>
                                setSelectedAllergies((prev) =>
                                    prev.filter((a) => a !== item),
                                )
                            }
                            aria-label={`${item} 제거`}
                        >
                            <div className="flex gap-5 items-center">
                                {item}

                                <CloseIcon />
                            </div>
                        </BaseButton>
                    ))}
                </div>

                <BaseFillButton
                    onClick={() => {
                        const menuButtons = document.querySelectorAll(
                            '[data-testid="menubar-content"] button',
                        );
                        const myInfoButton = Array.from(menuButtons).find(
                            (button) =>
                                button
                                    .getAttribute("aria-label")
                                    ?.includes("서비스 설정하기"),
                        );
                        if (myInfoButton) {
                            (myInfoButton as HTMLElement).focus();
                        }

                        chrome.storage.local.set(
                            {
                                Allergies: selectedAllergies,
                            },
                            () => {
                                onComplete?.();
                            },
                        );
                    }}
                >
                    저장하기
                </BaseFillButton>
            </div>
        </div>
    );
}
