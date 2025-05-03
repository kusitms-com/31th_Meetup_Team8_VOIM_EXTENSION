import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MenubarButton } from "../component";
import { AppThemeProvider } from "@src/contexts/ThemeContext";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppThemeProvider>{children}</AppThemeProvider>
);

describe("MenubarButton", () => {
    it("버튼이 정상적으로 렌더링된다", () => {
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={false}
                    text="Button Text"
                    ariaLabel="Button"
                />
            </Wrapper>,
        );

        expect(screen.getByText("Button Text")).toBeInTheDocument();
    });

    it("isSelected가 true일 때 스타일이 변경된다", () => {
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={true}
                    text="Button Text"
                    ariaLabel="Button"
                />
            </Wrapper>,
        );

        const button = screen.getByText("Button Text");

        expect(button).toHaveClass("bg-grayscale-100");
        expect(button).toHaveClass("text-grayscale-900");
        expect(button).toHaveClass("border-4");
        expect(button).toHaveClass("border-purple-default");
    });

    it("isSelected가 false일 때 스타일이 변경된다", () => {
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={false}
                    text="Button Text"
                    ariaLabel="Button"
                />
            </Wrapper>,
        );

        const button = screen.getByText("Button Text");

        expect(button).toHaveClass("bg-grayscale-100");
        expect(button).toHaveClass("text-grayscale-900");
        expect(button).toHaveClass("hover:opacity-30");
    });

    it("theme이 dark일 때, isSelected가 true인 경우에 스타일이 dark 모드로 적용된다", () => {
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={true}
                    text="Button Text"
                    ariaLabel="Button"
                />
            </Wrapper>,
        );

        const button = screen.getByText("Button Text");

        expect(button).toHaveClass("bg-grayscale-900");
        expect(button).toHaveClass("text-grayscale-100");
        expect(button).toHaveClass("border-purple-light");
    });

    it("onClick이 호출된다", () => {
        const handleClick = jest.fn();
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={false}
                    text="Button Text"
                    ariaLabel="Button"
                    onClick={handleClick}
                />
            </Wrapper>,
        );

        const button = screen.getByText("Button Text");
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("isSelected일 때 CheckmarkIcon이 나타난다", () => {
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={true}
                    text="Button Text"
                    ariaLabel="Button"
                />
            </Wrapper>,
        );

        expect(screen.getByTestId("checkmark-icon")).toBeInTheDocument();
    });

    it("isSelected가 false일 때 CheckmarkIcon이 나타나지 않는다", () => {
        render(
            <Wrapper>
                <MenubarButton
                    isSelected={false}
                    text="Button Text"
                    ariaLabel="Button"
                />
            </Wrapper>,
        );

        expect(screen.queryByTestId("checkmark-icon")).toBeNull();
    });
});
