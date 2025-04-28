import * as React from "react";
import { SizeController } from "../components";
import renderer from "react-test-renderer";

describe("SizeController", () => {
    it("renders minus button correctly", () => {
        const tree = renderer.create(<SizeController type="minus" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders plus button correctly", () => {
        const tree = renderer.create(<SizeController type="plus" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
