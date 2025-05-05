import React from "react";

const GetDarkmode = () => {
    const sendMessage = (
        type: "APPLY_WHITE_MODE" | "APPLY_YELLOW_MODE" | "APPLY_BLACK_MODE",
    ) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (!currentTab || !currentTab.id) return;

            const url = currentTab.url || "";

            if (url.startsWith("https://www.coupang.com")) {
                chrome.tabs.sendMessage(currentTab.id, { type });
            } else {
                console.error("쿠팡 페이지가 아닙니다. 현재 탭:", url);
                alert("쿠팡 페이지에서만 사용할 수 있어요!");
            }
        });
    };

    return (
        <div className="w-[200px] p-5 flex flex-col gap-2.5 font-sans">
            <button
                onClick={() => sendMessage("APPLY_WHITE_MODE")}
                className="p-2.5 rounded-[10px] bg-white text-black border-2 border-[#8914FF] font-bold cursor-pointer text-lg"
            >
                흰 배경
                <br />
                검정 글자
            </button>
            <button
                onClick={() => sendMessage("APPLY_YELLOW_MODE")}
                className="p-2.5 rounded-[10px] bg-[#f4c542] text-black font-bold cursor-pointer text-lg"
            >
                노란 배경
                <br />
                검정 글자
            </button>
            <button
                onClick={() => sendMessage("APPLY_BLACK_MODE")}
                className="p-2.5 rounded-[10px] bg-[#121212] text-white border-2 border-[#444444] font-bold cursor-pointer text-lg"
            >
                검정 배경
                <br />흰 글자
            </button>
        </div>
    );
};

export default GetDarkmode;
