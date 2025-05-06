import React, { useEffect } from "react";
import GetDarkmode from "@src/popup/darkmode/getDarkmode";

export function Popup() {
    return (
        <div>
            <div className="w-[500px] y-[500px] bg-white">
                <hr />
                <GetDarkmode />
            </div>
        </div>
    );
}
