import React from "react";
import styled from "@emotion/styled";

const ButtonContainer = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 12px;
`;

const ScrollButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #4a90e2;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: 500;

    &:hover {
        background-color: #357abd;
    }
`;

/**
 * Component that renders buttons to scroll to the top and bottom of the page
 */
export function Scroller(props: {
    onClickScrollTop: () => void;
    onClickScrollBottom: () => void;
}) {
    return (
        <ButtonContainer>
            <ScrollButton
                data-testid="scroll-to-top"
                onClick={() => props.onClickScrollTop()}
            >
                Scroll To Top
            </ScrollButton>
            <ScrollButton
                data-testid="scroll-to-bottom"
                onClick={() => props.onClickScrollBottom()}
            >
                Scroll To Bottom
            </ScrollButton>
        </ButtonContainer>
    );
}
