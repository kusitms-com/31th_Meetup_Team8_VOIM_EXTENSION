import React, { useState } from "react";
import { onboardingData } from "@src/assets/onboardingData";
import { useTheme } from "@src/contexts/ThemeContext";
import { CloseButton } from "@src/components/closeButton";
import { BaseButton } from "@src/components/baseButton/component";

export function Onboarding() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const { fontClasses, theme } = useTheme();
    const isDarkMode = theme === "dark";

    const sections = [
        onboardingData.info,
        onboardingData.image,
        onboardingData.product,
        onboardingData.theme,
    ];

    const handleNext = () => {
        if (currentPage < sections.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div
            className={`font-koddi px-[18px] py-[24px] rounded-[20px] w-[755px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] flex flex-col gap-[26px] ${
                isDarkMode
                    ? `bg-grayscale-900 text-grayscale-100`
                    : `bg-grayscale-100 text-grayscale-900`
            }`}
        >
            <div
                className={`${fontClasses.fontHeading} flex justify-between items-center`}
            >
                <div>{sections[currentPage].title}</div>
                <CloseButton
                    onClick={() => setCurrentPage(sections.length - 1)}
                />
            </div>
            <div>
                {sections[currentPage].phrase.map((text, index) => (
                    <div className={fontClasses.fontCommon} key={index}>
                        {text.split("\n").map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                        <br />
                    </div>
                ))}
            </div>
            <div className="onboarding-buttons">
                <BaseButton onClick={handleNext}>다음</BaseButton>
            </div>
        </div>
    );
}

export default Onboarding;
