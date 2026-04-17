import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type LoginOtpContext = Extract<KcContext, { pageId: "login-otp.ftl" }>;

export default function LoginOtp(props: PageProps<LoginOtpContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, otpLogin } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsSubmitting(true);
        void e;
    }

    const hasMultipleDevices = (otpLogin.userOtpCredentials?.length ?? 0) > 1;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
        >
            <form className="space-y-5" action={url.loginAction} method="post" onSubmit={handleSubmit}>
                <p className="text-sm text-muted-foreground -mt-1">
                    {msg("loginOtpOneTime")}
                </p>

                {/* Device selector */}
                {hasMultipleDevices && (
                    <div className="space-y-1.5">
                        <Label htmlFor="selectedCredentialId">
                            {advancedMsg("loginOtpDevice")}
                        </Label>
                        <select
                            id="selectedCredentialId"
                            name="selectedCredentialId"
                            defaultValue={otpLogin.selectedCredentialId}
                            disabled={isSubmitting}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {otpLogin.userOtpCredentials!.map(cred => (
                                <option key={cred.id} value={cred.id}>
                                    {cred.userLabel}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* OTP input */}
                <div className="space-y-1.5">
                    <Label htmlFor="otp">
                        {msg("loginOtpOneTime")}
                        <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        autoFocus
                        maxLength={8}
                        placeholder="000 000"
                        disabled={isSubmitting}
                        className={cn(
                            "flex h-14 w-full rounded-md border border-input bg-background px-4",
                            "text-center text-2xl font-semibold tracking-[0.4em] tabular-nums shadow-sm",
                            "placeholder:text-muted-foreground/40 placeholder:tracking-[0.4em]",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {msgStr("doLogIn")}
                </Button>
            </form>
        </Template>
    );
}
