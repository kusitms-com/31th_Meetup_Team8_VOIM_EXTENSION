import React from "react";
import { MenubarButton } from "@src/components/menubarButton";
import { FontSizeController } from "@src/components/fontSizeController";

export function Popup() {
    return (
        <div>
            <div className="w-[500px] y-[500px] bg-blue-400">
                <hr />
                <MenubarButton isSelected={true} text="버튼" />
                <FontSizeController />
            </div>
        </div>
    );
}
