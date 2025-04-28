import * as React from "react";
import { MenubarButton } from "../component";
import renderer from "react-test-renderer";

describe("MenubarButton", () => {
    it("renders selected button correctly", () => {
        const tree = renderer
            .create(<MenubarButton isSelected={true} text="선택된 버튼" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders unselected button correctly", () => {
        const tree = renderer
            .create(
                <MenubarButton isSelected={false} text="선택되지 않은 버튼" />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders with theme prop correctly", () => {
        const tree = renderer
            .create(
                <MenubarButton
                    isSelected={false}
                    text="테마 적용 버튼"
                    theme={true}
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders with both selected and theme props correctly", () => {
        const tree = renderer
            .create(
                <MenubarButton
                    isSelected={true}
                    text="선택된 테마 버튼"
                    theme={true}
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
