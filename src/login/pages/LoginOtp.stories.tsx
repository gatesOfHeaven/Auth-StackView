import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-otp.ftl" });

const meta = {
    title: "login/LoginOtp",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const MultipleDevices: Story = {
    args: {
        kcContext: {
            otpLogin: {
                userOtpCredentials: [
                    { id: "cred-1", userLabel: "Authenticator App" },
                    { id: "cred-2", userLabel: "Backup Phone" },
                ],
                selectedCredentialId: "cred-1",
            },
        },
    },
};
