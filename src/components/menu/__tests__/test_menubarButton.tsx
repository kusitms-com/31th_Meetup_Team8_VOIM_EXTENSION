import * as React from "react";
import Menubar from "../component";
import renderer from "react-test-renderer";

describe("Menubar", () => {
    it("renders closed menubar correctly", () => {
        const tree = renderer
            .create(
                <Menubar isOpen={false} onClose={() => {}}>
                    <div>메뉴바 콘텐츠</div>
                </Menubar>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders open menubar correctly", () => {
        const tree = renderer
            .create(
                <Menubar isOpen={true} onClose={() => {}}>
                    <div>메뉴바 콘텐츠</div>
                </Menubar>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders with custom content correctly", () => {
        const tree = renderer
            .create(
                <Menubar isOpen={true} onClose={() => {}}>
                    <div>
                        <h2>커스텀 제목</h2>
                        <p>커스텀 내용입니다.</p>
                        <button>확인</button>
                    </div>
                </Menubar>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders with complex nested content correctly", () => {
        const tree = renderer
            .create(
                <Menubar isOpen={true} onClose={() => {}}>
                    <div className="nested-content">
                        <h2>중첩된 콘텐츠</h2>
                        <ul>
                            <li>항목 1</li>
                            <li>항목 2</li>
                            <li>항목 3</li>
                        </ul>
                        <div className="actions">
                            <button className="cancel">취소</button>
                            <button className="confirm">확인</button>
                        </div>
                    </div>
                </Menubar>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
