import React from "react";
import { FontSizeController } from "../component";
import renderer from "react-test-renderer";
import { act } from "react-test-renderer";
import { SizeController } from "../../sizeController";

describe("FontSizeController", () => {
    it("fontSizeController가 올바르게 렌더링된다", () => {
        const tree = renderer.create(<FontSizeController />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("초기 텍스트 크기는 24이다", () => {
        const component = renderer.create(<FontSizeController />);
        const instance = component.root;

        expect(instance.findAllByType("div")[2].children[1]).toBe("24");
    });

    it("plus 버튼 클릭 시 텍스트 크기가 2씩 증가한다", () => {
        const component = renderer.create(<FontSizeController />);
        const instance = component.root;

        expect(instance.findAllByType("div")[2].children[1]).toBe("24");

        act(() => {
            instance.findAllByType(SizeController)[1].props.onClick();
        });

        expect(instance.findAllByType("div")[2].children[1]).toBe("26");
    });

    it("minus 버튼 클릭 시 텍스트 크기가 2씩 감소한다", () => {
        const component = renderer.create(<FontSizeController />);
        const instance = component.root;

        expect(instance.findAllByType("div")[2].children[1]).toBe("24");

        act(() => {
            instance.findAllByType(SizeController)[0].props.onClick();
        });

        expect(instance.findAllByType("div")[2].children[1]).toBe("22");
    });

    it("텍스트 크기가 최대값(28)을 초과하지 않는다", () => {
        const component = renderer.create(<FontSizeController />);
        const instance = component.root;

        act(() => {
            instance.findAllByType(SizeController)[1].props.onClick();
        });
        act(() => {
            instance.findAllByType(SizeController)[1].props.onClick();
        });

        expect(instance.findAllByType("div")[2].children[1]).toBe("28");

        act(() => {
            instance.findAllByType(SizeController)[1].props.onClick();
        });

        expect(instance.findAllByType("div")[2].children[1]).toBe("28");
    });

    it("텍스트 크기가 최소값(20)보다 작아지지 않는다", () => {
        const component = renderer.create(<FontSizeController />);
        const instance = component.root;

        act(() => {
            instance.findAllByType(SizeController)[0].props.onClick();
        });
        act(() => {
            instance.findAllByType(SizeController)[0].props.onClick();
        });

        expect(instance.findAllByType("div")[2].children[1]).toBe("20");

        act(() => {
            instance.findAllByType(SizeController)[0].props.onClick();
        });

        expect(instance.findAllByType("div")[2].children[1]).toBe("20");
    });
});
