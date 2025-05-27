import { useTheme } from "@src/contexts/ThemeContext";
import React from "react";
import { ContentBox } from "../contentBox";

export function ShortcutTab() {
    const { theme, fontClasses } = useTheme();
    const isDarkMode = theme === "dark";
    return (
        <div
            className={`font-koddi p-[18px] rounded-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] ${
                isDarkMode
                    ? `bg-grayscale-900 text-grayscale-100`
                    : `bg-grayscale-100 text-grayscale-900`
            }`}
        >
            <section role="region" aria-label="단축키 안내 섹션">
                <h2
                    className={`${fontClasses.fontCommon} mb-[20px]`}
                    aria-label="단축키 안내 보기"
                >
                    단축키 안내 보기
                </h2>
                <div
                    className="flex flex-col gap-4"
                    role="list"
                    aria-label="단축키 목록"
                    tabIndex={0}
                >
                    <ContentBox ariaLabel="메뉴 열기 또는 닫기 ALT + O">
                        <div tabIndex={-1}>메뉴 열기 또는 닫기</div>
                        <div tabIndex={-1}>ALT + O</div>
                    </ContentBox>
                    <ContentBox ariaLabel="서비스 아이콘 띄우기 또는 끄기 ALT + V">
                        <div tabIndex={-1}>서비스 아이콘 띄우기 또는 끄기</div>
                        <div tabIndex={-1}>ALT + V</div>
                    </ContentBox>
                    <ContentBox ariaLabel="서비스 실행하기 또는 종료하기 ALT + A">
                        <div tabIndex={-1}>서비스 실행하기 또는 종료하기</div>
                        <div tabIndex={-1}>ALT + A</div>
                    </ContentBox>
                </div>
            </section>
        </div>
    );
}
