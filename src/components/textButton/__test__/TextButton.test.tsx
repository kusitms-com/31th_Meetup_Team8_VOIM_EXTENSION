import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TextButton } from "../component";
import "@testing-library/jest-dom";

describe("TextButton", () => {
    it("버튼이 자식 텍스트와 함께 렌더링된다", () => {
        const { container } = render(
            <TextButton onClick={() => {}}>설정 초기화</TextButton>,
        );

        expect(screen.getByText("설정 초기화")).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it("버튼 클릭 시 onClick 핸들러가 호출된다", () => {
        const handleClick = jest.fn();
        render(<TextButton onClick={handleClick}>설정 초기화</TextButton>);

        fireEvent.click(screen.getByText("설정 초기화"));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("aria-label이 제공되었을 때 해당 aria-label이 적용된다", () => {
        render(
            <TextButton onClick={() => {}} ariaLabel="설정 초기화 버튼">
                설정 초기화
            </TextButton>,
        );

        expect(screen.getByRole("button")).toHaveAttribute(
            "aria-label",
            "설정 초기화 버튼",
        );
    });

    it("ariaLabel이 제공되지 않았을 때 자식 텍스트가 aria-label로 사용된다", () => {
        render(<TextButton onClick={() => {}}>설정 초기화</TextButton>);

        expect(screen.getByRole("button")).toHaveAttribute(
            "aria-label",
            "설정 초기화",
        );
    });

    it("children이 svg 요소일 경우 아이콘이 렌더링된다", () => {
        const { container } = render(
            <TextButton onClick={() => {}}>
                <svg width="24" height="24" fill="none">
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            </TextButton>,
        );

        expect(container.querySelector("svg")).toBeInTheDocument();
    });
});
