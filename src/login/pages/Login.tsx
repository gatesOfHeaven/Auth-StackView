import { useState, type FormEvent } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import styles from "./Login.module.css";

type LoginContext = Extract<KcContext, { pageId: "login.ftl" }>;

export default function Login(
    props: PageProps<LoginContext, I18n>
) {
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
        // let the browser submit natively — Keycloak handles the POST
        void e;
    }

    const usernameLabel =
        !realm.loginWithEmailAllowed
            ? msg("username")
            : !realm.registrationEmailAsUsername
              ? msg("usernameOrEmail")
              : msg("email");

    const usernameAutoComplete: string =
        !realm.loginWithEmailAllowed
            ? "username"
            : !realm.registrationEmailAsUsername
              ? "username email"
              : "email";

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
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <span>
                    {msg("noAccount")}{" "}
                    <a href={url.registrationUrl} className={styles.forgotLink}>
                        {msg("doRegister")}
                    </a>
                </span>
            }
        >
            {/* ── Social providers ── */}
            {hasSocialProviders && (
                <>
                    <div className={styles.socialList}>
                        {social!.providers!.map(p => (
                            <a
                                key={p.alias}
                                href={p.loginUrl}
                                className={styles.socialButton}
                            >
                                {p.displayName}
                            </a>
                        ))}
                    </div>

                    {realm.password && (
                        <div className={styles.divider}>
                            <span className={styles.dividerLine} />
                            <span className={styles.dividerText}>
                                {advancedMsgStr("or")}
                            </span>
                            <span className={styles.dividerLine} />
                        </div>
                    )}
                </>
            )}

            {/* ── Password login form ── */}
            {realm.password && (
                <form
                    className={styles.form}
                    action={url.loginAction}
                    method="post"
                    onSubmit={handleSubmit}
                >
                    {/* Username / email */}
                    {!usernameHidden && (
                        <div className={styles.fieldGroup}>
                            <label htmlFor="username" className={styles.label}>
                                {usernameLabel}
                                <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="username"
                                name="username"
                                type={realm.loginWithEmailAllowed && realm.registrationEmailAsUsername ? "email" : "text"}
                                autoComplete={usernameAutoComplete}
                                defaultValue={
                                    auth?.attemptedUsername ?? login.username ?? ""
                                }
                                autoFocus={!auth?.showUsername}
                                className={`${styles.input} ${
                                    messagesPerField.existsError("username")
                                        ? styles.inputError
                                        : ""
                                }`}
                                aria-invalid={messagesPerField.existsError("username")}
                                aria-describedby={
                                    messagesPerField.existsError("username")
                                        ? "username-error"
                                        : undefined
                                }
                                disabled={isSubmitting}
                            />
                            {messagesPerField.existsError("username") && (
                                <p
                                    id="username-error"
                                    className={styles.fieldError}
                                    dangerouslySetInnerHTML={{
                                        __html: messagesPerField.get("username"),
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Password */}
                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {msg("password")}
                            <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            autoFocus={!!usernameHidden}
                            className={`${styles.input} ${
                                messagesPerField.existsError("password")
                                    ? styles.inputError
                                    : ""
                            }`}
                            aria-invalid={messagesPerField.existsError("password")}
                            aria-describedby={
                                messagesPerField.existsError("password")
                                    ? "password-error"
                                    : undefined
                            }
                            disabled={isSubmitting}
                        />
                        {messagesPerField.existsError("password") && (
                            <p
                                id="password-error"
                                className={styles.fieldError}
                                dangerouslySetInnerHTML={{
                                    __html: messagesPerField.get("password"),
                                }}
                            />
                        )}
                    </div>

                    {/* Remember me + Forgot password */}
                    {(realm.rememberMe || realm.resetPasswordAllowed) && (
                        <div className={styles.rowOptions}>
                            {realm.rememberMe && (
                                <label className={styles.checkboxGroup}>
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        defaultChecked={!!login.rememberMe}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkboxLabel}>
                                        {msg("rememberMe")}
                                    </span>
                                </label>
                            )}
                            {realm.resetPasswordAllowed && (
                                <a
                                    href={url.loginResetCredentialsUrl}
                                    className={styles.forgotLink}
                                >
                                    {msg("doForgotPassword")}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Hidden credential id (multi-factor flows) */}
                    <input
                        type="hidden"
                        name="credentialId"
                        value={auth?.selectedCredential ?? ""}
                    />

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className={styles.spinner} />
                        ) : null}
                        {msgStr("doLogIn")}
                    </button>
                </form>
            )}
        </Template>
    );
}
