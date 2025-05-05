import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SettingsResetButton } from "../component";
import { useAppTheme, AppThemeProvider } from "@src/contexts/ThemeContext";
import { useEffect } from "react";

const ThemeWrapper = ({
    theme,
    children,
}: {
    theme: "light" | "dark";
    children: React.ReactNode;
}) => {
    const { setTheme } = useAppTheme();

    useEffect(() => {
        setTheme(theme);
    }, [setTheme, theme]);

    return <>{children}</>;
};

const meta: Meta<typeof SettingsResetButton> = {
    title: "Components/Settings/SettingsResetButton",
    component: SettingsResetButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: { action: "clicked" },
    },
    decorators: [
        (Story) => (
            <div style={{ padding: "1rem" }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SettingsResetButton>;

export const Light: Story = {
    decorators: [
        (Story) => (
            <AppThemeProvider>
                <Story />
            </AppThemeProvider>
        ),
    ],
};

export const Dark: Story = {
    decorators: [
        (Story) => (
            <AppThemeProvider>
                <ThemeWrapper theme="dark">
                    <Story />
                </ThemeWrapper>
            </AppThemeProvider>
        ),
    ],
};

export const Hover: Story = {
    decorators: [
        (Story) => (
            <AppThemeProvider>
                <div className="sb-pseudo-hover">
                    <Story />
                </div>
            </AppThemeProvider>
        ),
    ],
    parameters: {
        pseudo: { hover: true },
        docs: {
            description: {
                story: "버튼의 호버 상태를 시뮬레이션합니다.",
            },
        },
    },
};

export const Active: Story = {
    decorators: [
        (Story) => (
            <AppThemeProvider>
                <div className="sb-pseudo-active">
                    <Story />
                </div>
            </AppThemeProvider>
        ),
    ],
    parameters: {
        pseudo: { active: true },
        docs: {
            description: {
                story: "버튼의 클릭(액티브) 상태를 시뮬레이션합니다.",
            },
        },
    },
};
