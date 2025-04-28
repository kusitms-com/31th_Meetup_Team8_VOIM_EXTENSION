import React, { useEffect } from "react";
import browser from "webextension-polyfill";
import { MenubarButton } from "@src/components/menubarButton";

export function Popup() {
    useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);

    return (
        <div>
            <div className="w-[500px] y-[500px] bg-white">
                <hr />
                <MenubarButton isSelected={true} text="최호" />
            </div>
        </div>
    );
}
