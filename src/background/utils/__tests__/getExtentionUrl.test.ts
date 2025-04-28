import { getExtensionUrl } from "../getExtensionUrl";

describe("getExtensionUrl", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return chrome.runtime.getURL(path) if chrome.runtime.getURL exists", () => {
        const mockGetURL = jest.fn(
            (path: string) => `chrome-extension://fakeid/${path}`,
        );

        global.chrome = {
            runtime: {
                getURL: mockGetURL,
            },
        } as any;

        const result = getExtensionUrl("test.png");

        expect(mockGetURL).toHaveBeenCalledWith("test.png");
        expect(result).toBe("chrome-extension://fakeid/test.png");
    });

    it("should return `/images/path` if chrome.runtime.getURL does not exist", () => {
        // @ts-ignore - chrome 삭제 (존재하지 않는 상황 시뮬레이션)
        delete global.chrome;

        const result = getExtensionUrl("test.png");

        expect(result).toBe("/images/test.png");
    });
});
