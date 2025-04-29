import * as React from "react";
import { MenubarButton } from "../component";
import renderer from "react-test-renderer";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("MenubarButton", () => {
    // 스냅샷 테스트
    describe("스냅샷 테스트", () => {
        it("선택된 버튼이 올바르게 렌더링된다", () => {
            const tree = renderer
                .create(
                    <MenubarButton
                        isSelected={true}
                        text="선택된 버튼"
                        ariaLabel="선택된 버튼"
                    />,
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });

        it("선택되지 않은 버튼이 올바르게 렌더링된다", () => {
            const tree = renderer
                .create(
                    <MenubarButton
                        isSelected={false}
                        text="선택되지 않은 버튼"
                        ariaLabel="선택되지 않은 버튼"
                    />,
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
                        ariaLabel="테마 적용 버튼"
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
                        ariaLabel="선택된 테마 버튼"
                    />,
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });

        it("다른 ariaLabel 속성이 제공될 때 올바르게 렌더링된다", () => {
            const tree = renderer
                .create(
                    <MenubarButton
                        isSelected={false}
                        text="버튼 텍스트"
                        ariaLabel="커스텀 접근성 레이블"
                    />,
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });
    });

    // 기능 테스트
    describe("기능 테스트", () => {
        it("onClick 이벤트가 올바르게 실행된다", () => {
            const handleClick = jest.fn();
            render(
                <MenubarButton
                    isSelected={false}
                    text="클릭 테스트 버튼"
                    ariaLabel="클릭 테스트 버튼"
                    onClick={handleClick}
                />,
            );

            const button = screen.getByRole("menuitem", {
                name: /클릭 테스트 버튼/i,
            });
            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("아리아 레이블이 올바르게 적용된다", () => {
            render(
                <MenubarButton
                    isSelected={false}
                    text="테스트 버튼"
                    ariaLabel="접근성 레이블"
                />,
            );

            const button = screen.getByRole("menuitem", {
                name: /접근성 레이블/i,
            });
            expect(button).toHaveAttribute("aria-label", "접근성 레이블");
        });

        it("버튼이 올바른 ARIA 속성을 가지고 있다", () => {
            render(
                <MenubarButton
                    isSelected={true}
                    text="접근성 테스트"
                    ariaLabel="접근성 테스트"
                />,
            );

            const button = screen.getByRole("menuitem", {
                name: /접근성 테스트/i,
            });
            expect(button).toHaveAttribute("aria-selected", "true");
            expect(button).toHaveAttribute("aria-controls", "menubar");
            expect(button).toHaveAttribute("aria-haspopup", "menu");
            expect(button).toHaveAttribute("tabIndex", "0");
        });
    });

    // 엣지 케이스 테스트
    describe("엣지 케이스 테스트", () => {
        it("매우 긴 텍스트를 올바르게 렌더링한다", () => {
            const longText =
                "이것은 매우 긴 텍스트가 들어있는 메뉴 버튼입니다. 텍스트가 버튼 너비를 초과할 경우 어떻게 표시되는지 확인하기 위한 예시입니다.";

            const tree = renderer
                .create(
                    <MenubarButton
                        isSelected={false}
                        text={longText}
                        ariaLabel="긴 텍스트 버튼"
                    />,
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });

        it("빈 텍스트도 올바르게 렌더링한다", () => {
            const tree = renderer
                .create(
                    <MenubarButton
                        isSelected={false}
                        text=""
                        ariaLabel="빈 텍스트 버튼"
                    />,
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
