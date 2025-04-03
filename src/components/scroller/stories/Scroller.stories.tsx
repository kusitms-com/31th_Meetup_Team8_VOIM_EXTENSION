import { Scroller } from "../component";
import { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { action } from "@storybook/addon-actions";

// // // //

export default {
    title: "Components/Scroller",
    component: Scroller,
} as Meta<typeof Scroller>;

export const Render: StoryObj<typeof Scroller> = {
    args: {
        onClickScrollTop: action("click-scroll-top"),
        onClickScrollBottom: action("click-scroll-bottom"),
    },
};

export const ScrollTop: StoryObj<typeof Scroller> = {
    ...Render,
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByTestId("scroll-to-top"));
    },
};

export const ScrollBottom: StoryObj<typeof Scroller> = {
    ...Render,
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByTestId("scroll-to-bottom"));
    },
};
