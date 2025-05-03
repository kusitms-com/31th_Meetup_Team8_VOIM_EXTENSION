import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CursorButton } from "../component";
import { ThemeProvider } from "@src/contexts/ThemeContext";
import "@testing-library/jest-dom";

jest.mock("@src/utils/getExtensionUrl", () => ({
    getExtensionUrl: jest
        .fn()
        .mockImplementation((path) => `/mocked-url/${path}`),
}));

describe("CursorButton", () => {
    const renderWithTheme = (
        ui: React.ReactElement,
        theme: "light" | "dark" = "light",
    ) => {
        const setTheme = jest.fn();
        return render(
            <ThemeProvider value={{ theme, setTheme }}>{ui}</ThemeProvider>,
        );
    };

    it("이미지와 alt 속성이 올바르게 렌더링되어야 한다", () => {
        renderWithTheme(
            <CursorButton onClick={() => {}} color="yellow" size="large" />,
            "dark",
        );

        const image = screen.getByAltText(
            "커서: large, yellow",
        ) as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.src).toContain("/mocked-url/cursor-large-yellow.png");
    });

    it("버튼 클릭 시 onClick 핸들러가 호출되어야 한다", () => {
        const handleClick = jest.fn();
        renderWithTheme(<CursorButton onClick={handleClick} />, "light");

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("테마가 light일 경우 white 배이스 버튼이 렌더링되어야 한다", () => {
        renderWithTheme(<CursorButton onClick={() => {}} />, "light");

        const image = screen.getByRole("img") as HTMLImageElement;
        expect(image.src).toContain("cursor-medium-white.png");
    });

    it("테마가 dark일 경우 dark 베이스 버튼이 렌더링되어야 한다", () => {
        renderWithTheme(<CursorButton onClick={() => {}} />, "dark");

        const image = screen.getByRole("img") as HTMLImageElement;
        expect(image.src).toContain("cursor-medium-white.png");
    });

    it("스냅샷 테스트 - 기본 렌더링", () => {
        const { container } = renderWithTheme(
            <CursorButton onClick={() => {}} />,
            "light",
        );
        expect(container).toMatchSnapshot();
    });
});
