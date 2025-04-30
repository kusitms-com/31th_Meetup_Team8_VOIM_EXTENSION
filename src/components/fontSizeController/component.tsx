import React, { useState } from "react";
import { SizeController } from "../sizeController";

export function FontSizeController() {
    const [textSize, setTextSize] = useState(24);

    function handleSizeChange(type: "plus" | "minus") {
        if (type === "plus") {
            setTextSize((prev) => Math.min(prev + 2, 28));
        } else {
            setTextSize((prev) => Math.max(prev - 2, 20));
        }
    }
    return (
        <div className="w-[480px] h-[158px] flex-col flex gap-5 font-koddi text-grayscale-900 font-28-Bold">
            <div>text</div>
            <div
                className="p-3 flex justify-between bg-grayscale-200 items-center rounded-[20px]"
                role="group"
                aria-labelledby="font-size-label"
            >
                <SizeController
                    type="minus"
                    onClick={() => handleSizeChange("minus")}
                    alias-label="글자 크기 줄이기"
                />
                {textSize}
                <SizeController
                    type="plus"
                    onClick={() => handleSizeChange("plus")}
                    alias-label="글자 크기 늘리기"
                />
            </div>
        </div>
    );
}
