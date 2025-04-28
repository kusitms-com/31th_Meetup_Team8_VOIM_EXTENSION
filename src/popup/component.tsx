import React, { useEffect } from "react";
import { MenubarButton } from "@src/components/menubarButton";

export function Popup() {
    return (
        <div>
            <div className="w-[500px] y-[500px] bg-white">
                <hr />
                <MenubarButton isSelected={true} text="최호" />
            </div>
        </div>
    );
}
