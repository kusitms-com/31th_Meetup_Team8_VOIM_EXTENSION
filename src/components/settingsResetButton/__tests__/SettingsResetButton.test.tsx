import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsResetButton } from "../component";
import { ThemeProvider, useThemeMode } from "@src/contexts/ThemeContext";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";

const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

jest.mock("@src/contexts/ThemeContext", () => {
    const originalModule = jest.requireActual("@src/contexts/ThemeContext");
    return {
        ...originalModule,
        useThemeMode: jest.fn(),
    };
});

describe("SettingsResetButton", () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        mockLocalStorage.clear();
        jest.clearAllMocks();

        (useThemeMode as jest.Mock).mockImplementation(() => ({
            theme: "light",
            setTheme: jest.fn(),
        }));
    });

    const themeModes = ["light", "dark", "yellow"];

    themeModes.forEach((themeMode) => {
        it(`${themeMode} 테마에서 스냅샷이 일치하는지 확인`, () => {
            mockLocalStorage.getItem.mockReturnValueOnce(themeMode);

            (useThemeMode as jest.Mock).mockImplementation(() => ({
                theme: themeMode,
                setTheme: jest.fn(),
            }));

            const tree = renderer
                .create(
                    <ThemeProvider>
                        <SettingsResetButton onClick={jest.fn()} />
                    </ThemeProvider>,
                )
                .toJSON();

            expect(tree).toMatchSnapshot();
        });

        it(`${themeMode} 테마에서 올바르게 렌더링된다`, () => {
            mockLocalStorage.getItem.mockReturnValueOnce(themeMode);

            (useThemeMode as jest.Mock).mockImplementation(() => ({
                theme: themeMode,
                setTheme: jest.fn(),
            }));

            render(
                <ThemeProvider>
                    <SettingsResetButton onClick={mockOnClick} />
                </ThemeProvider>,
            );

            const button = screen.getByTestId("reset-settings-button");
            expect(button).toBeInTheDocument();

            const buttonText = screen.getByTestId("reset-settings-text");
            expect(buttonText).toHaveTextContent("설정 초기화");

            const svgElement = button.querySelector("svg");
            expect(svgElement).toBeInTheDocument();
        });

        it(`${themeMode} 테마에서 버튼 클릭 시 onClick이 호출된다`, () => {
            mockLocalStorage.getItem.mockReturnValueOnce(themeMode);

            (useThemeMode as jest.Mock).mockImplementation(() => ({
                theme: themeMode,
                setTheme: jest.fn(),
            }));

            render(
                <ThemeProvider>
                    <SettingsResetButton onClick={mockOnClick} />
                </ThemeProvider>,
            );

            const button = screen.getByTestId("reset-settings-button");
            fireEvent.click(button);

            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
    });

    it("올바른 접근성 속성을 가지고 있다", () => {
        render(
            <ThemeProvider>
                <SettingsResetButton onClick={mockOnClick} />
            </ThemeProvider>,
        );

        const button = screen.getByTestId("reset-settings-button");

        expect(button).toHaveAttribute("aria-label", "설정 초기화");
    });

    it("올바른 스타일링 클래스를 가지고 있다", () => {
        render(
            <ThemeProvider>
                <SettingsResetButton onClick={mockOnClick} />
            </ThemeProvider>,
        );

        const button = screen.getByTestId("reset-settings-button");
        expect(button).toHaveClass("px-6");
        expect(button).toHaveClass("py-[18px]");
        expect(button).toHaveClass("flex");
        expect(button).toHaveClass("gap-[10px]");
        expect(button).toHaveClass("items-center");
        expect(button).toHaveClass("cursor-pointer");
        expect(button).toHaveClass("rounded-[14px]");
        expect(button).toHaveClass("font-24-Bold");
        expect(button).toHaveClass("font-koddi");
    });

    it("유효하지 않은 테마인 경우 기본값(light)을 사용한다", () => {
        (useThemeMode as jest.Mock).mockImplementation(() => ({
            theme: "invalid-theme" as any,
            setTheme: jest.fn(),
        }));

        render(
            <ThemeProvider>
                <SettingsResetButton onClick={mockOnClick} />
            </ThemeProvider>,
        );

        const button = screen.getByTestId("reset-settings-button");
        expect(button).toBeInTheDocument();
        expect(screen.getByTestId("reset-settings-text")).toHaveTextContent(
            "설정 초기화",
        );
    });
});
