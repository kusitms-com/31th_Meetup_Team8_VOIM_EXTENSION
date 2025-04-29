import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import Menubar from "../component";
import { logger } from "@src/utils/logger";

jest.mock("@src/background/utils/getExtensionUrl", () => ({
    getExtensionUrl: (path: string) => `mocked-url/${path}`,
}));

beforeEach(() => {
    global.chrome = {
        runtime: {
            sendMessage: jest
                .fn()
                .mockResolvedValue({ success: true }) as jest.Mock,
        },
    } as any;
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Menubar", () => {
    it("컴포넌트가 올바르게 렌더링된다 (스냅샷)", () => {
        const { container } = render(
            <Menubar isOpen={true} onClose={() => {}}>
                hello
            </Menubar>,
        );

        expect(container).toMatchSnapshot();
    });

    it("isOpen이 true이면 모달이 보여야 한다", () => {
        render(
            <Menubar isOpen={true} onClose={() => {}}>
                hello
            </Menubar>,
        );
        expect(screen.getByTestId("menubar-overlay")).toBeInTheDocument();
        expect(screen.getByTestId("reset-settings-text")).toBeInTheDocument();
        expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("isOpen이 false이면 모달이 안 보여야 한다", () => {
        render(
            <Menubar isOpen={false} onClose={() => {}}>
                hello
            </Menubar>,
        );
        expect(screen.queryByTestId("menubar-overlay")).toBeNull();
        expect(screen.queryByTestId("reset-settings-text")).toBeNull();
        expect(screen.queryByTestId("close-icon")).toBeNull();
    });

    it("Overlay 클릭 시 onClose가 호출된다", () => {
        const onClose = jest.fn();
        render(
            <Menubar isOpen={true} onClose={onClose}>
                hello
            </Menubar>,
        );

        const overlay = screen.getByTestId("menubar-overlay");
        fireEvent.click(overlay);

        expect(onClose).toHaveBeenCalled();
    });

    it("나가기 버튼 클릭 시 onClose가 호출된다", () => {
        const onClose = jest.fn();
        render(
            <Menubar isOpen={true} onClose={onClose}>
                hello
            </Menubar>,
        );

        const closeButton = screen.getByTestId("close-button");
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();
    });

    it("설정 초기화 버튼 클릭 시 chrome.runtime.sendMessage가 호출된다", async () => {
        render(
            <Menubar isOpen={true} onClose={() => {}}>
                hello
            </Menubar>,
        );

        const resetButton = screen.getByTestId("reset-settings-button");
        fireEvent.click(resetButton);

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
            type: "RESET_SETTINGS",
        });
    });

    it("children이 제대로 렌더링된다", () => {
        render(
            <Menubar isOpen={true} onClose={() => {}}>
                <div data-testid="child-element">child</div>
            </Menubar>,
        );
        expect(screen.getByTestId("child-element")).toBeInTheDocument();
        expect(screen.getByText("child")).toBeInTheDocument();
    });

    it("설정 초기화 버튼 클릭 시 chrome.runtime.sendMessage 실패 시 에러 로그가 찍힌다", async () => {
        const errorMessage = "Failed to send message";

        (chrome.runtime.sendMessage as jest.Mock).mockRejectedValueOnce(
            new Error(errorMessage),
        );

        const logError = jest
            .spyOn(logger, "error")
            .mockImplementation(() => {});

        render(
            <Menubar isOpen={true} onClose={() => {}}>
                hello
            </Menubar>,
        );

        const resetButton = screen.getByTestId("reset-settings-button");

        await act(async () => {
            fireEvent.click(resetButton);

            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(logError).toHaveBeenCalledWith(
            "메시지 전송 중 오류:",
            expect.any(Error),
        );

        logError.mockRestore();
    });
});
