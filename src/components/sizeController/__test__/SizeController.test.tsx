import * as React from "react";
import { SizeController } from "../components";
import renderer from "react-test-renderer";

describe("SizeController", () => {
    it("- 버튼 렌더링", () => {
        const tree = renderer.create(<SizeController type="minus" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("+ 버튼 렌더링", () => {
        const tree = renderer.create(<SizeController type="plus" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
