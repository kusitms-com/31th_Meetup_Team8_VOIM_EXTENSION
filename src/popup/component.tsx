import React, { useEffect } from "react";
import { MenubarButton } from "@src/components/menubarButton";
import GetDarkmode from "@src/popup/darkmode/getDarkmode";

export function Popup() {
    return (
        <div>
            <div className="w-[500px] y-[500px] bg-white">
                <hr />
<<<<<<< HEAD
                <MenubarButton isSelected={true} text="최호" />
                <GetDarkmode />
                <Scroller
                    onClickScrollTop={() => {
                        executeScript(scrollToTopPosition);
                    }}
                    onClickScrollBottom={() => {
                        executeScript(scrollToBottomPosition);
                    }}
                />
=======
                <MenubarButton isSelected={true} text="버튼" />
>>>>>>> 544db6b11bc476c1d97f21ea720cdcaefe70c9a8
            </div>
        </div>
    );
}
