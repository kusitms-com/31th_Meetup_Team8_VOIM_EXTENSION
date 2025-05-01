import { SizeController } from "../component";

export default {
    title: "Components/SizeController",
    component: SizeController,
    parameters: {
        mockData: {
            getExtensionUrl: (path: string) => `/${path}`,
        },
    },
};

export const Minus = {
    args: {
        type: "minus",
    },
};

export const Plus = {
    args: {
        type: "plus",
    },
};
