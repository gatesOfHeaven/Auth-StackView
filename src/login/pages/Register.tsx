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

    const social = (kcContext as Record<string, unknown>).social as
        | { displayInfo: boolean; providers?: Array<{ alias: string; providerId: string; displayName: string; loginUrl: string }> }
        | undefined;

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
            displayMessage={messagesPerField.exists("global")}
            headerNode={msg("registerTitle")}
        >
            {/* ── Social providers ── */}
            {(social?.providers?.length ?? 0) > 0 && (
                <>
                    <div className="space-y-2">
                        {social.providers!.map(p => (
                            <Button key={p.alias} variant="outline" className="w-full" asChild>
                                <a href={p.loginUrl} className="flex items-center gap-2">
                                    {(p.alias === "gitlab" || p.providerId === "gitlab") && <GitLabIcon className="size-4 shrink-0" />}
                                    {p.displayName}
                                </a>
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                </>
            )}

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
                            error={fieldError("password")}
                        />
                        <Field
                            id="password-confirm"
                            name="password-confirm"
                            type="password"
                            label={msgStr("passwordConfirm")}
                            autoComplete="new-password"
                            required
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

function GitLabIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 380 380" xmlns="http://www.w3.org/2000/svg">
            <path fill="#E24329" d="M282.83 170.73l-.27-.69-26.14-68.22a6.81 6.81 0 00-2.69-3.24 7 7 0 00-8 .43 7 7 0 00-2.29 3.53l-17.68 54H154.29l-17.68-54a6.86 6.86 0 00-2.29-3.53 7 7 0 00-8-.43 6.87 6.87 0 00-2.69 3.24L97.44 170l-.26.69a48.54 48.54 0 0016.1 56.1l.09.07.24.17 39.82 29.82 19.7 14.91 12 9.06a8.07 8.07 0 009.26 0l12-9.06 19.7-14.91 40.06-30 .1-.08a48.56 48.56 0 0016.08-56.04z"/>
            <path fill="#FC6D26" d="M282.83 170.73l-.27-.69a88.3 88.3 0 00-35.15 15.8L190 229.25c19.55 14.79 36.57 27.64 36.57 27.64l40.06-30 .1-.08a48.56 48.56 0 0016.1-56.08z"/>
            <path fill="#FCA326" d="M153.43 256.89l19.7 14.91 12 9.06a8.07 8.07 0 009.26 0l12-9.06 19.7-14.91S209.55 244 190 229.25c-19.55 14.79-36.57 27.64-36.57 27.64z"/>
            <path fill="#FC6D26" d="M132.58 185.84A88.19 88.19 0 0097.44 170l-.26.69a48.54 48.54 0 0016.1 56.1l.09.07.24.17 39.82 29.82s17-12.85 36.57-27.64z"/>
        </svg>
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
