import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" });

const meta = {
    title: "login/Error",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithClientLink: Story = {
    args: {
        kcContext: {
            message: { type: "error", summary: "An unexpected error occurred. Please try again." },
            client: { baseUrl: "https://app.example.com" },
            skipLink: false,
        },
    },
};

export const NoBackLink: Story = {
    args: {
        kcContext: {
            message: { type: "error", summary: "Session expired. Please close this window." },
            skipLink: true,
        },
    },
};
