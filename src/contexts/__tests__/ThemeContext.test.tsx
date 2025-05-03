import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppThemeProvider, useAppTheme } from "../ThemeContext";

beforeAll(() => {
    global.chrome = {
        storage: {
            local: {
                get: jest.fn(() =>
                    Promise.resolve({
                        "theme-mode": "light",
                        "font-size": "m",
                        "font-weight": "bold",
                    }),
                ),
                set: jest.fn(() => Promise.resolve()),
            },
        },
    } as any;
});

afterEach(() => {
    jest.clearAllMocks();
});

function TestComponent() {
    const {
        theme,
        setTheme,
        fontSize,
        setFontSize,
        fontWeight,
        setFontWeight,
        fontClasses,
    } = useAppTheme();

    return (
        <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="fontSize">{fontSize}</div>
            <div data-testid="fontWeight">{fontWeight}</div>
            <div data-testid="headingClass">{fontClasses.fontHeading}</div>
            <button onClick={() => setTheme("dark")}>Set Dark Theme</button>
            <button onClick={() => setFontSize("xl")}>Set Font Size XL</button>
            <button onClick={() => setFontWeight("xbold")}>
                Set Font Weight XBold
            </button>
        </div>
    );
}

describe("AppThemeProvider", () => {
    it("초기 context 값을 불러온다", async () => {
        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("theme").textContent).toBe("light");
            expect(screen.getByTestId("fontSize").textContent).toBe("m");
            expect(screen.getByTestId("fontWeight").textContent).toBe("bold");
        });
    });

    it("테마 변경 시 chrome.storage에 저장된다", async () => {
        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        const btn = screen.getByText("Set Dark Theme");
        fireEvent.click(btn);

        await waitFor(() => {
            expect(screen.getByTestId("theme").textContent).toBe("dark");
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                "theme-mode": "dark",
            });
        });
    });

    it("폰트 사이즈 및 두께 변경 시 chrome.storage에 저장된다", async () => {
        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        fireEvent.click(screen.getByText("Set Font Size XL"));
        fireEvent.click(screen.getByText("Set Font Weight XBold"));

        await waitFor(() => {
            expect(screen.getByTestId("fontSize").textContent).toBe("xl");
            expect(screen.getByTestId("fontWeight").textContent).toBe("xbold");

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                "font-size": "xl",
            });
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                "font-weight": "xbold",
            });
        });
    });

    it("폰트 클래스가 올바르게 적용된다", async () => {
        render(
            <AppThemeProvider>
                <TestComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("headingClass").textContent).toContain(
                "text-[28px]",
            );
            expect(screen.getByTestId("headingClass").textContent).toContain(
                "font-bold",
            );
        });
    });

    it("AppThemeProvider 밖에서 사용하면 에러를 던진다", () => {
        const TestComponent = () => {
            useAppTheme();
            return <div />;
        };

        expect(() => render(<TestComponent />)).toThrowError(
            "useAppTheme must be used within an AppThemeProvider",
        );
    });
});
