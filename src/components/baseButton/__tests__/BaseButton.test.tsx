import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BaseButton } from "../component";

describe("BaseButton", () => {
    const buttonText = "테스트 버튼";
    it("스냅샷 테스트", () => {
        const { asFragment } = render(
            <BaseButton onClick={() => {}} color="purple" isSelected={false}>
                {buttonText}
            </BaseButton>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
    it("버튼이 렌더링된다", () => {
        render(<BaseButton onClick={() => {}}>{buttonText}</BaseButton>);
        const button = screen.getByRole("button", { name: buttonText });
        expect(button).toBeInTheDocument();
    });

    it("onClick 함수가 호출된다", () => {
        const handleClick = jest.fn();
        render(<BaseButton onClick={handleClick}>{buttonText}</BaseButton>);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("aria-label이 있으면 올바르게 적용된다", () => {
        render(
            <BaseButton onClick={() => {}} ariaLabel="커스텀 레이블">
                {buttonText}
            </BaseButton>,
        );
        const button = screen.getByLabelText("커스텀 레이블");
        expect(button).toBeInTheDocument();
    });

    it("aria-pressed 속성이 isSelected에 따라 반영된다", () => {
        const { rerender } = render(
            <BaseButton onClick={() => {}} isSelected={false}>
                {buttonText}
            </BaseButton>,
        );
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-pressed", "false");

        rerender(
            <BaseButton onClick={() => {}} isSelected={true}>
                {buttonText}
            </BaseButton>,
        );
        expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("color prop에 따라 클래스가 적용된다", () => {
        render(
            <BaseButton onClick={() => {}} color="purple">
                {buttonText}
            </BaseButton>,
        );
        const button = screen.getByRole("button");
        expect(button.className).toMatch(/bg-purple-default/);
    });

    it("isSelected가 true일 때 selected 스타일이 적용된다", () => {
        render(
            <BaseButton onClick={() => {}} color="purple" isSelected={true}>
                {buttonText}
            </BaseButton>,
        );
        const button = screen.getByRole("button");
        expect(button.className).toMatch(/border-purple-default/);
    });
});
