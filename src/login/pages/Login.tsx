import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type LoginContext = Extract<KcContext, { pageId: "login.ftl" }>;

export default function Login(props: PageProps<LoginContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        registrationDisabled,
        messagesPerField,
    } = kcContext;

    const { msg, msgStr, advancedMsgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsSubmitting(true);
        void e;
    }

    const usernameLabel =
        !realm.loginWithEmailAllowed
            ? msg("username")
            : !realm.registrationEmailAsUsername
              ? msg("usernameOrEmail")
              : msg("email");

    const hasSocialProviders = (social?.providers?.length ?? 0) > 0;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={
                realm.password && realm.registrationAllowed && !registrationDisabled
            }
            infoNode={
                <>
                    {msg("noAccount")}{" "}
                    <a href={url.registrationUrl} className="font-medium text-foreground underline-offset-4 hover:underline">
                        {msg("doRegister")}
                    </a>
                </>
            }
        >
            {/* ── Social providers ── */}
            {hasSocialProviders && (
                <div className="space-y-2">
                    {social!.providers!.map(p => (
                        <Button key={p.alias} variant="outline" className="w-full" asChild>
                            <a href={p.loginUrl} className="flex items-center gap-2">
                                {(p.alias === "gitlab" || p.providerId === "gitlab") && <GitLabIcon className="size-4 shrink-0" />}
                                {p.displayName}
                            </a>
                        </Button>
                    ))}
                </div>
            )}

            {/* ── Divider ── */}
            {hasSocialProviders && realm.password && (
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {advancedMsgStr("or")}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>
            )}

            {/* ── Credentials form ── */}
            {realm.password && (
                <form
                    className="space-y-4"
                    action={url.loginAction}
                    method="post"
                    onSubmit={handleSubmit}
                >
                    {/* Username / email */}
                    {!usernameHidden && (
                        <div className="space-y-1.5">
                            <Label htmlFor="username">
                                {usernameLabel}
                                <span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type={
                                    realm.loginWithEmailAllowed &&
                                    realm.registrationEmailAsUsername
                                        ? "email"
                                        : "text"
                                }
                                autoComplete="username email"
                                defaultValue={auth?.attemptedUsername ?? login.username ?? ""}
                                autoFocus={!auth?.showUsername}
                                hasError={messagesPerField.existsError("username")}
                            />
                            {messagesPerField.existsError("username") && (
                                <FieldError html={messagesPerField.get("username")} />
                            )}
                        </div>
                    )}

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">
                                {msg("password")}
                                <span className="text-destructive ml-0.5">*</span>
                            </Label>
                            {realm.resetPasswordAllowed && (
                                <a
                                    href={url.loginResetCredentialsUrl}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {msg("doForgotPassword")}
                                </a>
                            )}
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            autoFocus={!!usernameHidden}
                            hasError={messagesPerField.existsError("password")}
                        />
                        {messagesPerField.existsError("password") && (
                            <FieldError html={messagesPerField.get("password")} />
                        )}
                    </div>

                    {/* Remember me */}
                    {realm.rememberMe && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                defaultChecked={login.rememberMe === "on"}
                                className="size-4 rounded border-input accent-zinc-900 cursor-pointer"
                            />
                            <span className="text-sm text-muted-foreground">
                                {msg("rememberMe")}
                            </span>
                        </label>
                    )}

                    <input
                        type="hidden"
                        name="credentialId"
                        value={auth?.selectedCredential ?? ""}
                    />

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="animate-spin" />}
                        {msgStr("doLogIn")}
                    </Button>
                </form>
            )}
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

function FieldError({ html }: { html: string }) {
    return (
        <p
            className="text-xs text-destructive mt-1"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
