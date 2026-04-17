import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "info.ftl" });

const meta = {
    title: "login/Info",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const EmailVerification: Story = {
    args: {
        kcContext: {
            message: {
                type: "success",
                summary:
                    "You need to verify your email address to activate your account.",
            },
            requiredActions: ["VERIFY_EMAIL"],
            skipLink: false,
            client: { baseUrl: "https://app.example.com" },
        },
    },
};

export const WithRedirectLink: Story = {
    args: {
        kcContext: {
            message: {
                type: "success",
                summary: "Your account has been updated successfully.",
            },
            pageRedirectUri: "https://app.example.com/dashboard",
            skipLink: false,
        },
    },
};

export const MultipleRequiredActions: Story = {
    args: {
        kcContext: {
            message: {
                type: "info",
                summary: "The following actions are required before you can proceed:",
            },
            requiredActions: ["UPDATE_PASSWORD", "UPDATE_PROFILE", "VERIFY_EMAIL"],
            actionUri: "https://auth.example.com/action",
            skipLink: false,
        },
    },
};

export const NoLinks: Story = {
    args: {
        kcContext: {
            message: {
                type: "info",
                summary: "Please contact your administrator for further assistance.",
            },
            skipLink: true,
        },
    },
};
