import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "login/Login",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithEmail: Story = {
    args: {
        kcContext: {
            realm: { loginWithEmailAllowed: true, registrationEmailAsUsername: true },
        },
    },
};

export const WithFieldErrors: Story = {
    args: {
        kcContext: {
            messagesPerField: {
                existsError: (...fields: string[]) =>
                    fields.some(f => f === "username" || f === "password"),
                get: (field: string) =>
                    field === "username"
                        ? "Invalid username."
                        : "Invalid password.",
                exists: (field: string) =>
                    field === "username" || field === "password",
                printIfExists: <T,>(field: string, x: T) =>
                    field === "username" || field === "password" ? x : undefined,
            },
        },
    },
};

export const WithRememberMe: Story = {
    args: {
        kcContext: {
            realm: { rememberMe: true, resetPasswordAllowed: true },
            login: { rememberMe: "on" as never, username: "alice@example.com" },
        },
    },
};

export const RegistrationDisabled: Story = {
    args: {
        kcContext: {
            registrationDisabled: true,
        },
    },
};

export const WithGitLabLogin: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        alias: "gitlab",
                        displayName: "GitLab",
                        loginUrl: "#",
                        providerId: "gitlab",
                        iconClasses: "",
                    },
                ],
            },
        },
    },
};
