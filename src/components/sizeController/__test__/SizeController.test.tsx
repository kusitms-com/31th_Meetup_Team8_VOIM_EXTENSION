import * as React from "react";
import { SizeController } from "../component";
import renderer from "react-test-renderer";

describe("SizeController", () => {
    const mockOnClick = jest.fn();

    afterEach(() => {
        mockOnClick.mockClear();
    });

    it("- 버튼 렌더링", () => {
        const tree = renderer
            .create(<SizeController type="minus" onClick={mockOnClick} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("+ 버튼 렌더링", () => {
        const tree = renderer
            .create(<SizeController type="plus" onClick={mockOnClick} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("클릭 이벤트 테스트", () => {
        const component = renderer.create(
            <SizeController type="plus" onClick={mockOnClick} />,
        );

        const rootInstance = component.root;
        const divElement = rootInstance.findByType("div");

        divElement.props.onClick();

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
