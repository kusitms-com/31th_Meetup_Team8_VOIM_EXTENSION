import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Menubar from "../component";
import "@testing-library/jest-dom";
import { logger } from "@src/utils/logger";

jest.mock("@src/background/utils/getExtensionUrl", () => ({
    getExtensionUrl: jest
        .fn()
        .mockImplementation((path) => `mocked-url/${path}`),
}));

jest.mock("@src/utils/logger", () => ({
    logger: {
        debug: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("@src/components/settingsResetButton", () => ({
    SettingsResetButton: ({ onClick }: { onClick: () => void }) => (
        <button data-testid="settings-reset-button" onClick={onClick}>
            Reset Settings
        </button>
    ),
}));

global.chrome = {
    runtime: {
        sendMessage: jest
            .fn()
            .mockImplementation(() => Promise.resolve({ success: true })),
    },
} as unknown as typeof chrome;

describe("Menubar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (chrome.runtime.sendMessage as jest.Mock).mockImplementation(() =>
            Promise.resolve({ success: true }),
        );
    });
    it("스냅샷 테스트", () => {
        const { asFragment } = render(
            <Menubar isOpen={true} onClose={jest.fn()}>
                <div>Test Content</div>
            </Menubar>,
        );

        expect(asFragment()).toMatchSnapshot();
    });
    it("isOpen이 false일 때 렌더링하지 않는다", () => {
        render(
            <Menubar isOpen={false} onClose={jest.fn()}>
                <div>Test Content</div>
            </Menubar>,
        );

        expect(screen.queryByTestId("menubar-overlay")).not.toBeInTheDocument();
    });

    it("isOpen이 true일 때 children을 렌더링한다", () => {
        render(
            <Menubar isOpen={true} onClose={jest.fn()}>
                <div data-testid="test-child">Test Content</div>
            </Menubar>,
        );

        expect(screen.getByTestId("menubar-overlay")).toBeInTheDocument();
        expect(screen.getByTestId("menubar-container")).toBeInTheDocument();
        expect(screen.getByTestId("test-child")).toBeInTheDocument();
        expect(screen.getByTestId("test-child")).toHaveTextContent(
            "Test Content",
        );
    });

    it("닫기 버튼을 클릭하면 onClose가 호출된다", () => {
        const onCloseMock = jest.fn();
        render(
            <Menubar isOpen={true} onClose={onCloseMock}>
                <div>Test Content</div>
            </Menubar>,
        );

        fireEvent.click(screen.getByTestId("close-button"));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("오버레이를 클릭하면 onClose가 호출된다", () => {
        const onCloseMock = jest.fn();
        render(
            <Menubar isOpen={true} onClose={onCloseMock}>
                <div>Test Content</div>
            </Menubar>,
        );

        fireEvent.click(screen.getByTestId("menubar-overlay"));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("컨테이너를 클릭해도 onClose가 호출되지 않는다", () => {
        const onCloseMock = jest.fn();
        render(
            <Menubar isOpen={true} onClose={onCloseMock}>
                <div>Test Content</div>
            </Menubar>,
        );

        fireEvent.click(screen.getByTestId("menubar-container"));
        expect(onCloseMock).not.toHaveBeenCalled();
    });

    it("설정 초기화 버튼을 클릭하면 RESET_SETTINGS 메시지를 전송한다", () => {
        render(
            <Menubar isOpen={true} onClose={jest.fn()}>
                <div>Test Content</div>
            </Menubar>,
        );

        fireEvent.click(screen.getByTestId("settings-reset-button"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
            type: "RESET_SETTINGS",
        });
    });

    it("설정 초기화에 성공하면 디버그 로그를 출력한다", async () => {
        render(
            <Menubar isOpen={true} onClose={jest.fn()}>
                <div>Test Content</div>
            </Menubar>,
        );

        fireEvent.click(screen.getByTestId("settings-reset-button"));

        await Promise.resolve();

        expect(logger.debug).toHaveBeenCalledWith("설정이 초기화되었습니다.");
    });

    it("메시지 전송 중 오류가 발생하면 에러 로그를 출력한다", async () => {
        const error = new Error("메시지 전송 실패");
        (global.chrome.runtime.sendMessage as jest.Mock).mockImplementation(
            () => {
                return Promise.reject(error);
            },
        );

        render(
            <Menubar
                isOpen={true}
                onClose={() => {}}
                children={<div>test</div>}
            />,
        );

        const resetButton = screen.getByTestId("settings-reset-button");
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(logger.error).toHaveBeenCalledWith(
                "메시지 전송 중 오류:",
                error,
            );
        });
    });

    it("이미지 URL이 올바르게 생성된다", () => {
        render(
            <Menubar isOpen={true} onClose={jest.fn()}>
                <div>Test Content</div>
            </Menubar>,
        );

        const closeIcon = screen.getByTestId("close-icon");
        expect(closeIcon).toHaveAttribute("src", "mocked-url/delete.png");
        expect(closeIcon).toHaveAttribute("alt", "나가기");
    });
});
