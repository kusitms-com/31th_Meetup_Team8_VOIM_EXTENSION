import React, { useEffect } from "react";
import { MenubarButton } from "@src/components/menubarButton";
import GetDarkmode from "@src/popup/darkmode/getDarkmode";

export function Popup() {
    return (
        <div>
            <div className="w-[500px] y-[500px] bg-white">
                <hr />
                <MenubarButton isSelected={true} text="버튼" />
                <GetDarkmode />
            </div>
        </div>
    );
}
