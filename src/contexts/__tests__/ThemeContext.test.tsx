import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AppThemeProvider, useAppTheme } from "../ThemeContext";

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
    const { theme, setTheme } = useAppTheme();
    return (
        <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme("light")} data-testid="set-light">
                Light
            </button>
            <button onClick={() => setTheme("dark")} data-testid="set-dark">
                Dark
            </button>
        </div>
    );
};

describe("AppThemeProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.clear();
    });

    it("기본 테마가 'light'로 설정된다", () => {
        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("light");
    });

    it("localStorage에 저장된 테마를 불러온다", () => {
        mockLocalStorage.getItem.mockReturnValueOnce("dark");

        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("dark");
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme-mode");
    });

    it("setTheme 함수로 테마를 변경하고 localStorage에 저장한다", () => {
        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("light");

        act(() => {
            screen.getByTestId("set-dark").click();
        });

        expect(screen.getByTestId("current-theme").textContent).toBe("dark");
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            "theme-mode",
            "dark",
        );
    });

    it("AppThemeProvider 없이 useAppTheme를 사용하면 에러가 발생한다", () => {
        const consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(() => {});

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useAppTheme must be used within a AppThemeProvider");

        consoleErrorSpy.mockRestore();
    });
});

describe("AppThemeProvider 통합 테스트", () => {
    it("다중 컴포넌트에서 테마가 동기화된다", () => {
        const ThemeDisplay = () => {
            const { theme } = useAppTheme();
            return <div data-testid="theme-display">{theme}</div>;
        };

        const ThemeChanger = () => {
            const { setTheme } = useAppTheme();
            return (
                <button
                    onClick={() => setTheme("dark")}
                    data-testid="change-theme"
                >
                    Change to Dark
                </button>
            );
        };

        render(
            <AppThemeProvider>
                <div>
                    <ThemeDisplay />
                    <ThemeChanger />
                </div>
            </AppThemeProvider>,
        );

        expect(screen.getByTestId("theme-display").textContent).toBe("light");

        act(() => {
            screen.getByTestId("change-theme").click();
        });

        expect(screen.getByTestId("theme-display").textContent).toBe("dark");
    });

    it("잘못된 테마 값이 localStorage에 있을 경우에도 해당 값이 사용된다", () => {
        mockLocalStorage.getItem.mockReturnValueOnce("invalid-theme");

        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        expect(screen.getByTestId("current-theme").textContent).toBe("light");
    });
});
