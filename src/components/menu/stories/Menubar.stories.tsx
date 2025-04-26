import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import Menubar from "../component";

const meta: Meta<typeof Menubar> = {
    title: "Components/Menubar",
    component: Menubar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Menubar>;

const MenubarController: React.FC<{ initialState?: boolean }> = ({
    initialState = false,
}) => {
    const [isOpen, setIsOpen] = useState(initialState);

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Open Menubar
            </button>

            <Menubar isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="p-4">
                    <h2 className="mb-4 text-xl font-bold">Menubar Content</h2>
                    <p className="mb-2">
                        This is an example of menubar content.
                    </p>
                    <ul className="pl-5 mb-4 list-disc">
                        <li>Menu Item 1</li>
                        <li>Menu Item 2</li>
                        <li>Menu Item 3</li>
                    </ul>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </Menubar>
        </div>
    );
};

export const Default: Story = {
    render: () => <MenubarController />,
};

export const InitiallyOpen: Story = {
    render: () => <MenubarController initialState={true} />,
};

export const WithCustomContent: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    Open Custom Menubar
                </button>

                <Menubar isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="p-4">
                        <h2 className="mb-4 text-xl font-bold">Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Theme
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option>Light</option>
                                    <option>Dark</option>
                                    <option>System</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifications"
                                    className="mr-2"
                                />
                                <label htmlFor="notifications">
                                    Enable notifications
                                </label>
                            </div>

                            <div className="flex justify-end pt-4 space-x-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </Menubar>
            </div>
        );
    },
};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
    },
    render: () => <MenubarController />,
};
