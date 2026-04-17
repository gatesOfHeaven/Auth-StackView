import { useState, type FormEvent } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import styles from "./Register.module.css";

type RegisterContext = Extract<KcContext, { pageId: "register.ftl" }>;

export default function Register(
    props: PageProps<RegisterContext, I18n>
) {
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

    /* ── Derive initial field values from profile attributes ── */
    function attrValue(name: string): string {
        return profile.attributesByName[name]?.value ?? "";
    }

    /* Whether a given attribute is in the profile (realm may omit some) */
    function hasAttr(name: string): boolean {
        return name in profile.attributesByName;
    }

    const showUsername = !realm.registrationEmailAsUsername;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("registerTitle")}
            displayInfo={false}
        >
            <form
                className={styles.form}
                action={url.registrationAction}
                method="post"
                onSubmit={handleSubmit}
            >
                {/* ── Name row ── */}
                {(hasAttr("firstName") || hasAttr("lastName")) && (
                    <div className={styles.row}>
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
                                error={
                                    messagesPerField.existsError("firstName")
                                        ? messagesPerField.get("firstName")
                                        : undefined
                                }
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
                                error={
                                    messagesPerField.existsError("lastName")
                                        ? messagesPerField.get("lastName")
                                        : undefined
                                }
                            />
                        )}
                    </div>
                )}

                {/* ── Email ── */}
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
                        error={
                            messagesPerField.existsError("email")
                                ? messagesPerField.get("email")
                                : undefined
                        }
                    />
                )}

                {/* ── Username (only when email ≠ username) ── */}
                {showUsername && hasAttr("username") && (
                    <Field
                        id="username"
                        name="username"
                        type="text"
                        label={msgStr("username")}
                        autoComplete="username"
                        defaultValue={attrValue("username")}
                        required
                        disabled={isSubmitting}
                        error={
                            messagesPerField.existsError("username")
                                ? messagesPerField.get("username")
                                : undefined
                        }
                    />
                )}

                {/* ── Password section ── */}
                {passwordRequired && (
                    <>
                        <div className={styles.divider} />

                        <Field
                            id="password"
                            name="password"
                            type="password"
                            label={msgStr("password")}
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                            error={
                                messagesPerField.existsError("password")
                                    ? messagesPerField.get("password")
                                    : undefined
                            }
                        />

                        <Field
                            id="password-confirm"
                            name="password-confirm"
                            type="password"
                            label={msgStr("passwordConfirm")}
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                            error={
                                messagesPerField.existsError("password-confirm")
                                    ? messagesPerField.get("password-confirm")
                                    : undefined
                            }
                        />
                    </>
                )}

                {/* ── reCAPTCHA ── */}
                {recaptchaRequired && recaptchaSiteKey && (
                    <div
                        className="g-recaptcha"
                        data-size="compact"
                        data-sitekey={recaptchaSiteKey}
                    />
                )}

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting && <span className={styles.spinner} />}
                    {msgStr("doRegister")}
                </button>
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

function Field({
    id,
    name,
    type,
    label,
    autoComplete,
    defaultValue = "",
    required = false,
    disabled = false,
    error,
}: FieldProps) {
    const hasError = error !== undefined;
    return (
        <div className={styles.fieldGroup}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                disabled={disabled}
                required={required}
                className={`${styles.input} ${hasError ? styles.inputError : ""}`}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${id}-error` : undefined}
            />
            {hasError && (
                <p
                    id={`${id}-error`}
                    className={styles.fieldError}
                    dangerouslySetInnerHTML={{ __html: error! }}
                />
            )}
        </div>
    );
}
