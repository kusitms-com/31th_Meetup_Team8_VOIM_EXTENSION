import React from "react";

interface TextButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
}

export function TextButton({
    children,
    onClick,
    ariaLabel = "",
}: TextButtonProps): JSX.Element {
    return (
        <button
            className="font-24-Bold font-koddi text-grayscale-100 px-6 py-[18px] flex justify-center items-center bg-purple-default hover:bg-purple-dark rounded-[14px]"
            onClick={onClick}
            aria-label={
                ariaLabel || (typeof children === "string" ? children : "")
            }
            role="button"
        >
            {children}
        </button>
    );
}
