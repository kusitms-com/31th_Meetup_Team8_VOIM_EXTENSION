import * as React from "react";
import { MenubarButton } from "../component";
import renderer from "react-test-renderer";

describe("MenubarButton", () => {
    it("선택된 버튼이 올바르게 렌더링된다", () => {
        const tree = renderer
            .create(<MenubarButton isSelected={true} text="선택된 버튼" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("선택되지 않은 버튼이 올바르게 렌더링된다", () => {
        const tree = renderer
            .create(
                <MenubarButton isSelected={false} text="선택되지 않은 버튼" />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("테마 속성이 적용된 버튼이 올바르게 렌더링된다", () => {
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

    it("선택 상태와 테마 속성이 모두 적용된 버튼이 올바르게 렌더링된다", () => {
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
