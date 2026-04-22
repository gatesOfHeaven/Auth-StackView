import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import type { UserProfileMetadata, UserRepresentation } from "../api/representations";
import { UserProfileView, type UserProfileViewProps } from "./UserProfile";

const meta = {
    title: "account/User Profile",
    component: UserProfileStoryContent,
    parameters: {
        layout: "fullscreen"
    }
} satisfies Meta<typeof UserProfileStoryContent>;

export default meta;

type Story = StoryObj<typeof meta>;

const map = {
    personalInfo: "User Profile",
    personalInfoDescription: "View and edit your profile details.",
    save: "Save",
    cancel: "Cancel"
} as const;

const mockT = ((key: string) => map[key as keyof typeof map] ?? key) as unknown as UserProfileViewProps["t"];

const userProfileMetadata: UserProfileMetadata = {
    attributes: [
        {
            name: "username",
            displayName: "Username",
            required: true,
            readOnly: false,
            validators: {},
            multivalued: false
        },
        {
            name: "firstName",
            displayName: "First name",
            required: false,
            readOnly: false,
            validators: {},
            multivalued: false
        },
        {
            name: "lastName",
            displayName: "Last name",
            required: false,
            readOnly: false,
            validators: {},
            multivalued: false
        },
        {
            name: "email",
            displayName: "Email",
            required: false,
            readOnly: false,
            validators: {},
            multivalued: false
        },
        {
            name: "bio",
            displayName: "Bio",
            required: false,
            readOnly: false,
            validators: {},
            multivalued: false,
            annotations: {
                inputType: "textarea"
            }
        }
    ]
};

const user: UserRepresentation = {
    username: "assel",
    firstName: "Assel",
    lastName: "K.",
    email: "assel@example.com",
    attributes: {
        bio: "Building the account console theme."
    }
};

function UserProfileStoryContent({
    readOnlyUsername = false
}: {
    readOnlyUsername?: boolean;
}) {
    const form = useForm<UserRepresentation>({
        mode: "onChange",
        defaultValues: user
    });

    const metadata: UserProfileMetadata = {
        attributes: userProfileMetadata.attributes.map(attribute =>
            attribute.name === "username"
                ? { ...attribute, readOnly: readOnlyUsername }
                : attribute
        )
    };

    return (
        <UserProfileView
            title="User Profile"
            description="View and edit your profile details."
            form={form}
            userProfileMetadata={metadata}
            supportedLocales={[]}
            currentLocale="en"
            t={mockT}
            onSubmit={event => event.preventDefault()}
            onCancel={() => undefined}
            submitLabel="Save"
            cancelLabel="Cancel"
        />
    );
}

export const Default: Story = {
    args: {}
};

export const ReadOnlyUsername: Story = {
    args: {
        readOnlyUsername: true
    }
};
