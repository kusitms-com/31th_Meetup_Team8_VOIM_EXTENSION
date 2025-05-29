interface CosmeticRequestPayload {
    productId: string;
    html: string;
}

interface CosmeticAPIResponse {
    status: number;
    message?: string;
    data: Record<string, boolean>;
}

export const sendCosmeticDataRequest = (
    payload: CosmeticRequestPayload,
): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "FETCH_COSMETIC_DATA",
                payload,
            },
            (response: unknown) => {
                if (!response || typeof response !== "object") {
                    return reject(new Error("Invalid response format"));
                }

                const res = response as CosmeticAPIResponse;

                if (res.status !== 200) {
                    return reject(new Error(`API 실패 status: ${res.status}`));
                }

                const data = res.data;
                if (!data || typeof data !== "object") {
                    return reject(new Error("올바르지 않은 응답 형식"));
                }

                const detected = Object.entries(data)
                    .filter(([_, v]) => v === true)
                    .map(([k]) => k);

                resolve(detected);
            },
        );
    });
};
