import { useTheme } from "@src/contexts/ThemeContext";
import React from "react";

interface ReviewSummary {
    totalCount: number;
    averageRating: number;
    positiveReviews: string[];
    negativeReviews: string[];
    keywords: string[];
}

interface ReviewSummaryComponentProps {
    summary: ReviewSummary;
}

export const ReviewSummaryComponent = ({
    summary,
}: ReviewSummaryComponentProps) => {
    const { fontClasses, theme } = useTheme();
    const isDarkMode = theme === "dark";

    return (
        <div
            className={`${fontClasses.fontCommon} ${
                isDarkMode ? "text-grayscale-100" : "text-grayscale-900 "
            }`}
        >
            <div
                className={`${fontClasses.fontHeading} ${
                    isDarkMode ? "text-purple-default" : "text-purple-default "
                }  mt-5`}
            >
                리뷰는 {summary.totalCount}개이며, 전체 평점은{" "}
                {summary.averageRating.toFixed(2)}입니다.
            </div>
            <div className="mt-10">
                <h3>주요 리뷰 키워드</h3>
                <div className="mt-4">
                    <div className="grid grid-cols-3 gap-4 ">
                        {summary.keywords.map((keyword, index) => (
                            <div
                                className={`${isDarkMode ? "bg-grayscale-800 " : "bg-grayscale-200 "} px-6 pt-[18px] pb-[16px] rounded-[14px]`}
                                key={index}
                            >
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-[30px]">
                <h3>긍정적 리뷰</h3>
                <div
                    className={`${isDarkMode ? "bg-grayscale-800 " : "bg-grayscale-200 "} px-6 py-[18px] rounded-[14px] mt-4`}
                >
                    <div>
                        {summary.positiveReviews.map((review, index) => (
                            <React.Fragment key={index}>
                                <div>{review}</div>
                                {index !==
                                    summary.positiveReviews.length - 1 && (
                                    <div
                                        className={`${isDarkMode ? "bg-grayscale-700 " : "bg-grayscale-300 "} my-[15px] w-full h-[2px] `}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-[30px]">
                <h3>부정적 리뷰</h3>
                <div
                    className={`${isDarkMode ? "bg-grayscale-800 " : "bg-grayscale-200 "} px-6 py-[18px] rounded-[14px] mt-4`}
                >
                    <div>
                        {summary.negativeReviews.map((review, index) => (
                            <React.Fragment key={index}>
                                <div>{review}</div>
                                {index !==
                                    summary.negativeReviews.length - 1 && (
                                    <div
                                        className={`${isDarkMode ? "bg-grayscale-700 " : "bg-grayscale-300 "} my-[15px] w-full h-[2px] `}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
