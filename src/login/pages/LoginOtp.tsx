import { useState, type FormEvent } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import styles from "./LoginOtp.module.css";

type LoginOtpContext = Extract<KcContext, { pageId: "login-otp.ftl" }>;

export default function LoginOtp(
    props: PageProps<LoginOtpContext, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, otpLogin } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsSubmitting(true);
        void e;
    }

    const hasMultipleDevices =
        (otpLogin.userOtpCredentials?.length ?? 0) > 1;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
        >
            <form
                className={styles.form}
                action={url.loginAction}
                method="post"
                onSubmit={handleSubmit}
            >
                <p className={styles.hint}>{msg("loginOtpOneTime")}</p>

                {/* ── Device picker (only when user has > 1 OTP credential) ── */}
                {hasMultipleDevices && (
                    <div className={styles.fieldGroup}>
                        <label htmlFor="selectedCredentialId" className={styles.label}>
                            {advancedMsg("loginOtpDevice")}
                        </label>
                        <select
                            id="selectedCredentialId"
                            name="selectedCredentialId"
                            className={styles.select}
                            defaultValue={otpLogin.selectedCredentialId}
                            disabled={isSubmitting}
                        >
                            {otpLogin.userOtpCredentials!.map(cred => (
                                <option key={cred.id} value={cred.id}>
                                    {cred.userLabel}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ── OTP code input ── */}
                <div className={styles.fieldGroup}>
                    <label htmlFor="otp" className={styles.label}>
                        {msg("loginOtpOneTime")}
                        <span className={styles.required}>*</span>
                    </label>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoFocus
                        className={styles.otpInput}
                        placeholder="000000"
                        disabled={isSubmitting}
                        maxLength={8}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting && <span className={styles.spinner} />}
                    {msgStr("doLogIn")}
                </button>
            </form>
        </Template>
    );
}
