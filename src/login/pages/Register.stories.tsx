import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/Register",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithFieldErrors: Story = {
    args: {
        kcContext: {
            messagesPerField: {
                existsError: (...fields: string[]) =>
                    fields.some(f =>
                        ["firstName", "email", "password", "password-confirm"].includes(f)
                    ),
                get: (field: string) => {
                    const errors: Record<string, string> = {
                        firstName: "Please enter your first name.",
                        email: "This email is already registered.",
                        password: "Password must be at least 8 characters.",
                        "password-confirm": "Passwords do not match.",
                    };
                    return errors[field] ?? "";
                },
                exists: (field: string) =>
                    ["firstName", "email", "password", "password-confirm"].includes(field),
                printIfExists: <T,>(field: string, x: T) =>
                    ["firstName", "email", "password", "password-confirm"].includes(field)
                        ? x
                        : undefined,
            },
        },
    },
};

export const EmailAsUsername: Story = {
    args: {
        kcContext: {
            realm: { registrationEmailAsUsername: true },
        },
    },
};

export const NoPasswordRequired: Story = {
    args: {
        kcContext: {
            passwordRequired: false,
        },
    },
};

export const WithGitLabLogin: Story = {
    args: {
        kcContext: {
            // social is not typed on register.ftl but Keycloak passes it at runtime
            ...(({
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
            }) as object),
        },
    },
};
