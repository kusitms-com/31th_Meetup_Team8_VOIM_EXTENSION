export const sendOutlineInfoRequest = (
    outline: "MAIN" | "USAGE" | "WARNING" | "SPECS" | "CERTIFICATION",
    html: string,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "FETCH_OUTLINE_INFO",
                payload: { outline, html },
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (response?.type === "OUTLINE_INFO_RESPONSE") {
                    resolve(response.data);
                } else if (response?.type === "OUTLINE_INFO_ERROR") {
                    reject(new Error(response.error));
                } else {
                    reject(new Error("Unknown response format"));
                }
            },
        );
    });
};
