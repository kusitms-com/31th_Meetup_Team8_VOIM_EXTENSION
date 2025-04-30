import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SizeController } from "../component";

describe("SizeController", () => {
    const mockOnClick = jest.fn();

    afterEach(() => {
        mockOnClick.mockClear();
    });

    it("- 버튼 렌더링", () => {
        render(<SizeController type="minus" onClick={mockOnClick} />);
        expect(screen.getByTestId("size-controller-button")).toMatchSnapshot();
    });

    it("+ 버튼 렌더링", () => {
        render(<SizeController type="plus" onClick={mockOnClick} />);
        expect(screen.getByTestId("size-controller-button")).toMatchSnapshot();
    });

    it("클릭 이벤트 테스트", () => {
        render(<SizeController type="plus" onClick={mockOnClick} />);

        const button = screen.getByTestId("size-controller-button");

        // fireEvent로 클릭 이벤트를 발생시킴
        fireEvent.click(button);

        // onClick이 한 번 호출되었는지 확인
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
