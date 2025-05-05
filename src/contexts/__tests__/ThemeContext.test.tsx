import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppThemeProvider, useAppTheme } from "../ThemeContext";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockedChrome = chrome as any;

const DummyComponent = () => {
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
            <div data-testid="fontHeading">{fontClasses.fontHeading}</div>
            <button onClick={() => setTheme("light")}>Set Light Theme</button>
            <button onClick={() => setTheme("dark")}>Set Dark Theme</button>
            <button onClick={() => setFontSize("s")}>
                Set Font Size Small
            </button>
            <button onClick={() => setFontWeight("regular")}>
                Set Font Weight Regular
            </button>
        </div>
    );
};

describe("AppThemeProvider", () => {
    beforeEach(() => {
        mockedChrome.storage.local.get.mockReset();
        mockedChrome.storage.local.set.mockReset();
    });

    it("기본값으로 시작", async () => {
        mockedChrome.storage.local.get.mockResolvedValue({});

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("theme")).toHaveTextContent("light");
            expect(screen.getByTestId("fontSize")).toHaveTextContent("xl");
            expect(screen.getByTestId("fontWeight")).toHaveTextContent("xbold");
        });
    });

    it("저장된 설정값 불러오기", async () => {
        mockedChrome.storage.local.get.mockResolvedValue({
            "theme-mode": "dark",
            "font-size": "m",
            "font-weight": "bold",
        });

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("theme")).toHaveTextContent("dark");
            expect(screen.getByTestId("fontSize")).toHaveTextContent("m");
            expect(screen.getByTestId("fontWeight")).toHaveTextContent("bold");
        });
    });

    it("테마 변경 및 저장", async () => {
        const user = userEvent.setup();
        mockedChrome.storage.local.get.mockResolvedValue({});

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("theme")).toHaveTextContent("light");
        });

        await user.click(screen.getByText("Set Dark Theme"));

        await waitFor(() => {
            expect(screen.getByTestId("theme")).toHaveTextContent("dark");
            expect(mockedChrome.storage.local.set).toHaveBeenCalledWith({
                "theme-mode": "dark",
            });
        });
    });

    it("글자 크기 변경 및 저장", async () => {
        const user = userEvent.setup();
        mockedChrome.storage.local.get.mockResolvedValue({});

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("fontSize")).toHaveTextContent("xl");
        });

        await user.click(screen.getByText("Set Font Size Small"));

        await waitFor(() => {
            expect(screen.getByTestId("fontSize")).toHaveTextContent("s");
            expect(mockedChrome.storage.local.set).toHaveBeenCalledWith({
                "font-size": "s",
            });
        });
    });

    it("글자 굵기 변경 및 저장", async () => {
        const user = userEvent.setup();
        mockedChrome.storage.local.get.mockResolvedValue({});

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("fontWeight")).toHaveTextContent("xbold");
        });

        await user.click(screen.getByText("Set Font Weight Regular"));

        await waitFor(() => {
            expect(screen.getByTestId("fontWeight")).toHaveTextContent(
                "regular",
            );
            expect(mockedChrome.storage.local.set).toHaveBeenCalledWith({
                "font-weight": "regular",
            });
        });
    });

    it("저장된 값에 따라 fontClasses 계산", async () => {
        mockedChrome.storage.local.get.mockResolvedValue({
            "font-size": "xs",
            "font-weight": "regular",
        });

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            const fontHeading = screen.getByTestId("fontHeading");
            expect(fontHeading).toHaveTextContent(/text-\[24px\]/);
            expect(fontHeading).toHaveTextContent(/font-normal/);
        });
    });

    it("Provider 없이 훅 사용 시 에러 발생", () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const BrokenComponent = () => {
            useAppTheme();
            return null;
        };

        type ErrorBoundaryProps = {
            children: React.ReactNode;
        };

        type ErrorBoundaryState = {
            hasError: boolean;
        };

        class ErrorBoundary extends React.Component<
            ErrorBoundaryProps,
            ErrorBoundaryState
        > {
            constructor(props: ErrorBoundaryProps) {
                super(props);
                this.state = { hasError: false };
            }

            static getDerivedStateFromError(): ErrorBoundaryState {
                return { hasError: true };
            }

            render(): React.ReactNode {
                if (this.state.hasError) {
                    return <div data-testid="error">에러 발생</div>;
                }
                return this.props.children;
            }
        }

        render(
            <ErrorBoundary>
                <BrokenComponent />
            </ErrorBoundary>,
        );

        expect(screen.getByTestId("error")).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });

    it("잘못된 값 처리", async () => {
        mockedChrome.storage.local.get.mockResolvedValue({
            "font-size": "invalid-size",
            "font-weight": "invalid-weight",
        });

        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        render(
            <AppThemeProvider>
                <DummyComponent />
            </AppThemeProvider>,
        );

        await waitFor(() => {
            expect(screen.getByTestId("fontSize")).toHaveTextContent("xl");
            expect(screen.getByTestId("fontWeight")).toHaveTextContent("xbold");
        });

        consoleErrorSpy.mockRestore();
    });
});
