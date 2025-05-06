import React, { useEffect, useState } from "react";
import { FontButton } from "./component";

const ControlFont = () => {
    const [selectedWeight, setSelectedWeight] = useState("XBOLD");
    const [selectedSize, setSelectedSize] = useState("M");

    const weightMap: Record<string, string> = {
        얇게: "REGULAR",
        기본: "BOLD",
        두껍게: "XBOLD",
    };

    const sizeMap: Record<string, string> = {
        "아주 작게": "XS",
        작게: "S",
        기본: "M",
        크게: "L",
        "아주 크게": "XL",
    };
    useEffect(() => {
        const storedWeight = localStorage.getItem("selectedWeight");
        const storedSize = localStorage.getItem("selectedSize");

        if (storedWeight) setSelectedWeight(storedWeight);
        if (storedSize) setSelectedSize(storedSize);
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

    const handleWeightClick = (label: string) => {
        const value = weightMap[label];
        setSelectedWeight(value);
        localStorage.setItem("selectedWeight", value); // 저장
        sendMessage(`SET_FONT_WEIGHT_${value}`);
    };

    const handleSizeClick = (label: string) => {
        const value = sizeMap[label];
        setSelectedSize(value);
        localStorage.setItem("selectedSize", value); // 저장
        sendMessage(`SET_FONT_SIZE_${value}`);
    };

    return (
        <div className="w-[800px] h-[334px] inline-flex flex-col items-start p-[18px] rounded-[20px] bg-grayscale-100 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] space-y-[18px]">
            <div className="flex flex-col gap-[26px]">
                <h2 className="font-24-Bold">글자 두께 바꾸기</h2>
                <div className="flex gap-4">
                    {["얇게", "기본", "두껍게"].map((label) => (
                        <FontButton
                            key={label}
                            onClick={() => handleWeightClick(label)}
                            isSelected={weightMap[label] === selectedWeight}
                        >
                            {label}
                        </FontButton>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-[26px]">
                <h2 className="font-24-Bold">글자 크기 바꾸기</h2>
                <div className="flex gap-4 flex-wrap">
                    {["아주 작게", "작게", "기본", "크게", "아주 크게"].map(
                        (label) => (
                            <FontButton
                                key={label}
                                onClick={() => handleSizeClick(label)}
                                isSelected={sizeMap[label] === selectedSize}
                            >
                                {label}
                            </FontButton>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlFont;
