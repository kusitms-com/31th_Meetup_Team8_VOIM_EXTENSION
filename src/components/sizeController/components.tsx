import { getExtensionUrl } from "@src/utils/getExtensionUrl";
import React from "react";

interface SizeControllerProps {
    type: "minus" | "plus";
}

export function SizeController({ type }: SizeControllerProps): JSX.Element {
    return (
        <div className="px-[54px] py-[18px] inline-block rounded-[14px] bg-purple-default hover:bg-purple-dark">
            <img
                src={getExtensionUrl(`${type}.png`)}
                alt={type}
                className="w-[36px] h-[36px]"
            />
        </div>
    );
}
