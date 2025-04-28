import * as React from "react";
import renderer from "react-test-renderer";
import { FloatingButton } from "../component";

describe("FloatingButton", () => {
    it("기본 속성으로 올바르게 렌더링된다", () => {
        const mockOnClick = jest.fn();
        const tree = renderer
            .create(<FloatingButton onClick={mockOnClick} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("다른 아이콘 URL로 렌더링된다", () => {
        const mockOnClick = jest.fn();
        const tree = renderer
            .create(<FloatingButton onClick={mockOnClick} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("select-none 클래스가 적용된다", () => {
        const mockOnClick = jest.fn();
        const tree = renderer.create(<FloatingButton onClick={mockOnClick} />);

        const rootInstance = tree.root;
        const buttonContainer = rootInstance.findByProps({
            className: "select-none",
        });
        expect(buttonContainer).toBeTruthy();
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
