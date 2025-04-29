import { logger } from "../logger";

describe("logger", () => {
    beforeEach(() => {
        console.error = jest.fn();
        console.warn = jest.fn();
        console.log = jest.fn();
    });

    it("오류일 경우 console.error가 올바른 메시지와 인자로 호출되어야 한다", () => {
        const message = "오류가 발생했습니다";
        const args = [1, "테스트", { key: "value" }];

        logger.error(message, ...args);

        expect(console.error).toHaveBeenCalledWith(
            `[ERROR] ${message}`,
            ...args,
        );
    });

    it("경고일 경우 console.warn가 올바른 메시지와 인자로 호출되어야 한다", () => {
        const message = "경고 메시지입니다";
        const args = [true, "경고 테스트"];

        logger.warn(message, ...args);

        expect(console.warn).toHaveBeenCalledWith(`[WARN] ${message}`, ...args);
    });

    it("디버그 환경에서 console.log가 올바른 메시지와 인자와 함께 호출되어야 한다", () => {
        const message = "디버그 메시지";
        const args = [42, { debug: true }];

        process.env.NODE_ENV = "development";

        logger.debug(message, ...args);

        expect(console.log).toHaveBeenCalledWith(`[DEBUG] ${message}`, ...args);
    });

    it("프로덕션 환경에서는 디버그 메시지로 console.log가 호출되지 않아야 한다", () => {
        const message = "디버그 메시지";
        const args = [42, { debug: true }];

        process.env.NODE_ENV = "production";

        logger.debug(message, ...args);

        expect(console.log).not.toHaveBeenCalled();
    });
});
