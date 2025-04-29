import React from "react";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useThemeMode, ThemeMode } from "../ThemeContext";

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

Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
});

const TestComponent = () => {
    const { theme, setTheme } = useThemeMode();
    return (
        <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme("light")} data-testid="set-light">
                Light
            </button>
            <button onClick={() => setTheme("yellow")} data-testid="set-yellow">
                Yellow
            </button>
            <button onClick={() => setTheme("dark")} data-testid="set-dark">
                Dark
            </button>
        </div>
    );
};

describe("ThemeProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.clear();
    });

    it("기본 테마가 'light'로 설정된다", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("light");
    });

    it("localStorage에 저장된 테마를 불러온다", () => {
        mockLocalStorage.getItem.mockReturnValueOnce("dark");

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("dark");
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme-mode");
    });

    it("setTheme 함수로 테마를 변경하고 localStorage에 저장한다", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("light");

        act(() => {
            screen.getByTestId("set-yellow").click();
        });

        expect(screen.getByTestId("current-theme").textContent).toBe("yellow");
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            "theme-mode",
            "yellow",
        );

        act(() => {
            screen.getByTestId("set-dark").click();
        });

        expect(screen.getByTestId("current-theme").textContent).toBe("dark");
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            "theme-mode",
            "dark",
        );
    });

    it("ThemeProvider 없이 useThemeMode를 사용하면 에러가 발생한다", () => {
        const consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(() => {});

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useThemeMode must be used within a ThemeProvider");

        consoleErrorSpy.mockRestore();
    });
});

describe("ThemeProvider 통합 테스트", () => {
    it("다중 컴포넌트에서 테마가 동기화된다", () => {
        const ThemeDisplay = () => {
            const { theme } = useThemeMode();
            return <div data-testid="theme-display">{theme}</div>;
        };

        const ThemeChanger = () => {
            const { setTheme } = useThemeMode();
            return (
                <button
                    onClick={() => setTheme("yellow")}
                    data-testid="change-theme"
                >
                    Change to Yellow
                </button>
            );
        };

        render(
            <ThemeProvider>
                <div>
                    <ThemeDisplay />
                    <ThemeChanger />
                </div>
            </ThemeProvider>,
        );

        expect(screen.getByTestId("theme-display").textContent).toBe("light");

        act(() => {
            screen.getByTestId("change-theme").click();
        });

        expect(screen.getByTestId("theme-display").textContent).toBe("yellow");
    });

    it("잘못된 테마 값이 localStorage에 있을 경우에도 해당 값이 사용된다", () => {
        mockLocalStorage.getItem.mockReturnValueOnce("invalid-theme");

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe(
            "invalid-theme",
        );
    });
});
