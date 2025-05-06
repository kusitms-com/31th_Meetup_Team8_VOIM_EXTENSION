import React, { useState } from "react";
import { FontButton } from "./component";

const ControlFont = () => {
    const [selectedWeight, setSelectedWeight] = useState("두껍게");
    const [selectedSize, setSelectedSize] = useState("기본");

    const sendMessage = (type: string) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) return;
            chrome.tabs.sendMessage(tabs[0].id, { type }, (response) => {
                console.log("메시지 전송됨:", response);
            });
        });
    };

    const handleWeightClick = (weight: string) => {
        setSelectedWeight(weight);
        sendMessage(`SET_FONT_WEIGHT_${weight.toUpperCase()}`);
    };

    const handleSizeClick = (size: string) => {
        setSelectedSize(size);
        sendMessage(`SET_FONT_SIZE_${size.toUpperCase().replace(" ", "_")}`);
    };

    return (
        <div className="w-[800px] h-[334px] inline-flex flex-col items-start p-[18px] rounded-[20px] bg-grayscale-100 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] space-y-[18px]">
            <div className="flex flex-col gap-[26px]">
                <h2 className="font-24-Bold">글자 두께 바꾸기</h2>
                <div className="flex gap-4">
                    {["얇게", "기본", "두껍게"].map((weight) => (
                        <FontButton
                            key={weight}
                            onClick={() => handleWeightClick(weight)}
                            isSelected={selectedWeight === weight}
                        >
                            {weight}
                        </FontButton>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-[26px]">
                <h2 className="font-24-Bold">글자 크기 바꾸기</h2>
                <div className="flex gap-4 flex-wrap">
                    {["아주 작게", "작게", "기본", "크게", "아주 크게"].map(
                        (size) => (
                            <FontButton
                                key={size}
                                onClick={() => handleSizeClick(size)}
                                isSelected={selectedSize === size}
                            >
                                {size}
                            </FontButton>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlFont;
