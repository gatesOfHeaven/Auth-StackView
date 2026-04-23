/* eslint-disable */

// @ts-nocheck

import { useState, type ReactNode } from "react";
import { ErrorOption, useForm, type FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";

import {
    beerify,
    debeerify,
    setUserProfileServerError,
    useEnvironment,
} from "@keycloakify/keycloak-ui-shared/keycloak-theme/shared/keycloak-ui-shared";
import {
    AlertVariant,
    Spinner,
} from "@keycloakify/keycloak-ui-shared/keycloak-theme/shared/@patternfly/react-core";

import type { Environment } from "../environment";
type TFuncKey = any;
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";
import { loadUserProfile, updateUserProfile } from "../api/profileApi";
import type { UserProfileAttributeMetadata, UserProfileMetadata, UserRepresentation } from "../api/representations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ViewField = UserProfileAttributeMetadata;

const coreFields = new Set(["username", "firstName", "lastName", "email"]);

export default function UserProfile() {
    const { t } = useTranslation();
    const context = useEnvironment<Environment>();
    const [userProfileMetadata, setUserProfileMetadata] =
        useState<UserProfileMetadata>();
    const [supportedLocales, setSupportedLocales] = useState<string[]>([]);
    const form = useForm<UserRepresentation>({ mode: "onChange" });
    const { handleSubmit, reset, setValue, setError } = form;
    const { addAlert } = useAccountAlerts();

    usePromise(
        signal => loadUserProfile(context, signal),
        ({ personalInfo, supportedLocales }) => {
            setUserProfileMetadata(personalInfo.userProfileMetadata);
            setSupportedLocales(supportedLocales);
            reset(personalInfo);
            Object.entries(personalInfo.attributes || {}).forEach(([key, value]) =>
                setValue(`attributes[${beerify(key)}]`, value)
            );
        }
    );

    const onSubmit = async (user: UserRepresentation) => {
        try {
            const attributes = Object.fromEntries(
                Object.entries(user.attributes || {}).map(([key, value]) => [
                    debeerify(key),
                    value,
                ])
            );

            await updateUserProfile(context, { ...user, attributes });
            context.keycloak.updateToken();
            addAlert(t("accountUpdatedMessage"));
        } catch (error) {
            addAlert(t("somethingWentWrong"), AlertVariant.danger);
            setUserProfileServerError(
                { responseData: { errors: error as any } },
                (name: string | number, error: unknown) =>
                    setError(name as string, error as ErrorOption),
                ((key: TFuncKey, param?: object) => t(key, param as any)) as TFunction
            );
        }
    };

    if (!userProfileMetadata) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <Spinner />
            </div>
        );
    }

    return (
        <UserProfileView
            title={t("personalInfo")}
            description={t("personalInfoDescription")}
            form={form}
            userProfileMetadata={userProfileMetadata}
            supportedLocales={supportedLocales}
            currentLocale={context.environment.locale}
            t={((key: unknown, params) =>
                t(key as TFuncKey, params as any)) as TFunction}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => reset()}
            submitLabel={t("save")}
            cancelLabel={t("cancel")}
        />
    );
}

export type UserProfileViewProps = {
    title: string;
    description: string;
    form: ReturnType<typeof useForm<UserRepresentation>>;
    userProfileMetadata: UserProfileMetadata;
    supportedLocales: string[];
    currentLocale: string;
    t: TFunction;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    onCancel: () => void;
    submitLabel: ReactNode;
    cancelLabel: ReactNode;
};

export function UserProfileView({
    title,
    description,
    form,
    userProfileMetadata,
    onSubmit,
    onCancel,
    submitLabel,
    cancelLabel,
}: UserProfileViewProps) {
    const { register, formState } = form;

    const fields = userProfileMetadata.attributes;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-2xl space-y-7">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="size-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        SV
                    </div>
                    <span className="text-lg font-semibold text-zinc-900 tracking-tight">
                        StackView
                    </span>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {fields.map(attribute => (
                                    <ProfileField
                                        key={attribute.name}
                                        attribute={attribute}
                                        register={register}
                                        formErrors={formState.errors}
                                    />
                                ))}
                            </div>

                            <div className="space-y-4">
                                <Button
                                    data-testid="save"
                                    type="submit"
                                    id="save-btn"
                                    className="w-full"
                                    size="lg"
                                    variant="default"
                                >
                                    {submitLabel}
                                </Button>

                                <Button
                                    data-testid="cancel"
                                    id="cancel-btn"
                                    type="button"
                                    variant="link"
                                    className="w-full px-0 text-muted-foreground"
                                    onClick={onCancel}
                                >
                                    {cancelLabel}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ProfileField({
    attribute,
    register,
    formErrors,
}: {
    attribute: ViewField;
    register: ReturnType<typeof useForm<UserRepresentation>>["register"];
    formErrors: FieldErrors<UserRepresentation>;
}) {
    const name = fieldName(attribute.name);
    const fieldError = getFieldError(formErrors, name);
    const isTextArea = attribute.annotations?.inputType === "textarea";
    const isCore = coreFields.has(attribute.name);
    const readOnly = attribute.readOnly || (isCore && attribute.name === "username");
    const inputProps = register(name as any);

    return (
        <div className={isTextArea ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
            <Label htmlFor={name}>
                {attribute.displayName}
                {attribute.required && <span className="text-destructive ml-0.5">*</span>}
            </Label>

            {isTextArea ? (
                <Textarea
                    id={name}
                    hasError={!!fieldError}
                    readOnly={readOnly}
                    placeholder={attribute.displayName}
                    {...inputProps}
                />
            ) : (
                <Input
                    id={name}
                    type={attribute.name === "email" ? "email" : "text"}
                    hasError={!!fieldError}
                    readOnly={readOnly}
                    placeholder={attribute.displayName}
                    {...inputProps}
                />
            )}

            {fieldError && <FieldError html={fieldError} />}
        </div>
    );
}

function fieldName(name: string) {
    return coreFields.has(name) ? name : `attributes[${beerify(name)}]`;
}

function getFieldError(
    errors: FieldErrors<UserRepresentation>,
    name: string
): string | undefined {
    const segments = name
        .replace(/\]/g, "")
        .replace(/\[/g, ".")
        .split(".")
        .filter(Boolean);

    let current: unknown = errors;
    for (const segment of segments) {
        if (current == null || typeof current !== "object") {
            return undefined;
        }
        current = (current as Record<string, unknown>)[segment];
    }

    const message = (current as { message?: unknown } | undefined)?.message;
    return typeof message === "string" ? message : undefined;
}

function FieldError({ html }: { html: string }) {
    return (
        <p className="text-xs text-destructive mt-1" dangerouslySetInnerHTML={{ __html: html }} />
    );
}
