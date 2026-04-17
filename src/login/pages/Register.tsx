import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type RegisterContext = Extract<KcContext, { pageId: "register.ftl" }>;

export default function Register(props: PageProps<RegisterContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const {
        url,
        messagesPerField,
        passwordRequired,
        recaptchaRequired,
        recaptchaSiteKey,
        profile,
        realm,
    } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsSubmitting(true);
        void e;
    }

    const attrValue = (name: string) => profile.attributesByName[name]?.value ?? "";
    const hasAttr = (name: string) => name in profile.attributesByName;
    const fieldError = (name: string) =>
        messagesPerField.existsError(name) ? messagesPerField.get(name) : undefined;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("registerTitle")}
        >
            <form
                className="space-y-4"
                action={url.registrationAction}
                method="post"
                onSubmit={handleSubmit}
            >
                {/* ── Name row ── */}
                {(hasAttr("firstName") || hasAttr("lastName")) && (
                    <div className="grid grid-cols-2 gap-3">
                        {hasAttr("firstName") && (
                            <Field
                                id="firstName"
                                name="firstName"
                                type="text"
                                label={msgStr("firstName")}
                                autoComplete="given-name"
                                defaultValue={attrValue("firstName")}
                                required
                                disabled={isSubmitting}
                                error={fieldError("firstName")}
                            />
                        )}
                        {hasAttr("lastName") && (
                            <Field
                                id="lastName"
                                name="lastName"
                                type="text"
                                label={msgStr("lastName")}
                                autoComplete="family-name"
                                defaultValue={attrValue("lastName")}
                                required
                                disabled={isSubmitting}
                                error={fieldError("lastName")}
                            />
                        )}
                    </div>
                )}

                {hasAttr("email") && (
                    <Field
                        id="email"
                        name="email"
                        type="email"
                        label={msgStr("email")}
                        autoComplete="email"
                        defaultValue={attrValue("email")}
                        required
                        disabled={isSubmitting}
                        error={fieldError("email")}
                    />
                )}

                {!realm.registrationEmailAsUsername && hasAttr("username") && (
                    <Field
                        id="username"
                        name="username"
                        type="text"
                        label={msgStr("username")}
                        autoComplete="username"
                        defaultValue={attrValue("username")}
                        required
                        disabled={isSubmitting}
                        error={fieldError("username")}
                    />
                )}

                {passwordRequired && (
                    <>
                        <div className="border-t pt-2" />
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            label={msgStr("password")}
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                            error={fieldError("password")}
                        />
                        <Field
                            id="password-confirm"
                            name="password-confirm"
                            type="password"
                            label={msgStr("passwordConfirm")}
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                            error={fieldError("password-confirm")}
                        />
                    </>
                )}

                {recaptchaRequired && recaptchaSiteKey && (
                    <div
                        className="g-recaptcha"
                        data-size="compact"
                        data-sitekey={recaptchaSiteKey}
                    />
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {msgStr("doRegister")}
                </Button>
            </form>
        </Template>
    );
}

/* ── Reusable field ── */

type FieldProps = {
    id: string;
    name: string;
    type: "text" | "email" | "password";
    label: string;
    autoComplete?: string;
    defaultValue?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
};

function Field({ id, name, type, label, autoComplete, defaultValue = "", required, disabled, error }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            <Input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                required={required}
                disabled={disabled}
                hasError={!!error}
            />
            {error && (
                <p
                    className="text-xs text-destructive"
                    dangerouslySetInnerHTML={{ __html: error }}
                />
            )}
        </div>
    );
}
