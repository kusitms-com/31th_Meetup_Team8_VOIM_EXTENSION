import React, { useEffect, useState } from "react";
import { ModeButton } from "./component";
import { useAppTheme } from "@src/contexts/ThemeContext";

const ControlMode = () => {
    const [selectedMode, setSelectedMode] = useState("LIGHT");
    const { fontClasses } = useAppTheme();

    const modeMap: Record<string, "LIGHT" | "DARK"> = {
        "흰 배경\n검은 글씨": "LIGHT",
        "검은 배경\n흰 글씨": "DARK",
    };

    useEffect(() => {
        const storedMode = localStorage.getItem("selectedMode");
        if (storedMode) setSelectedMode(storedMode);
    }, []);

    const sendMessage = (type: string) => {
        chrome.runtime.sendMessage({ type }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("에러:", chrome.runtime.lastError.message);
            } else {
                console.log("응답:", response);
            }
        });
    };

    const handleModeClick = (label: string) => {
        const value = modeMap[label];
        setSelectedMode(value);
        localStorage.setItem("selectedMode", value);
        sendMessage(`SET_MODE_${value}`);
    };

    return (
        <div
            className="w-[430px] h-[250px] inline-flex flex-col items-start p-[18px] rounded-[20px] bg-grayscale-100 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] space-y-[18px]"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col gap-[26px]">
                <h2 className={fontClasses.fontCommon}>고대비 화면 설정하기</h2>
                <div className="flex gap-4 flex-wrap">
                    {Object.entries(modeMap).map(([label, value]) => (
                        <ModeButton
                            key={label}
                            onClick={() => handleModeClick(label)}
                            isSelected={value === selectedMode}
                            modeType={value}
                        >
                            {label.split("\n").map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </ModeButton>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ControlMode;
