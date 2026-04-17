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

    const hasSocialProviders =
        social?.displayInfo === true && (social.providers?.length ?? 0) > 0;

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
                            <a href={p.loginUrl}>{p.displayName}</a>
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
                                disabled={isSubmitting}
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
                            disabled={isSubmitting}
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

function FieldError({ html }: { html: string }) {
    return (
        <p
            className="text-xs text-destructive mt-1"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
