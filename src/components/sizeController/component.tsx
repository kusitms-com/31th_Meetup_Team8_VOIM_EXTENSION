import React from "react";
import { getExtensionUrl } from "@src/background/utils/getExtensionUrl";

interface SizeControllerProps {
    type: "minus" | "plus";
    onClick: () => void;
}

export function SizeController({
    type,
    onClick,
}: SizeControllerProps): JSX.Element {
    return (
        <button
            className="px-[54px] py-[18px] inline-block rounded-[14px] bg-purple-default active:bg-purple-dark hover:bg-purple-light"
            onClick={onClick}
            aria-label={type === "plus" ? "크기 증가" : "크기 감소"}
        >
            <img
                src={getExtensionUrl(`${type}.png`)}
                alt={type}
                draggable="false"
                className="w-[36px] h-[36px]"
            />
        </button>
    );
}
