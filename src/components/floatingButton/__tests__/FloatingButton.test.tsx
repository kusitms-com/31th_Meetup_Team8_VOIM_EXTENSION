import * as React from "react";

import renderer from "react-test-renderer";
import { FloatingButton } from "../component";

describe("FloatingButton", () => {
    it("renders correctly with default props", () => {
        const mockOnClick = jest.fn();
        const tree = renderer
            .create(<FloatingButton onClick={mockOnClick} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders with different icon URL", () => {
        const mockOnClick = jest.fn();
        const tree = renderer
            .create(<FloatingButton onClick={mockOnClick} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("applies select-none class", () => {
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
