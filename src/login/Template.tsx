import type { ReactNode } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import styles from "./Template.module.css";

type KcTemplateProps = TemplateProps<KcContext, I18n>;

export default function Template(props: KcTemplateProps) {
    const {
        kcContext,
        i18n: _i18n,
        doUseDefaultCss: _doUseDefaultCss,
        classes: _classes,
        displayInfo = false,
        displayMessage = true,
        headerNode,
        infoNode,
        children,
    } = props;

    const { message } = kcContext;

    const showMessage =
        displayMessage &&
        message !== undefined &&
        // suppress global warning when messagesPerField errors exist — those render inline
        !(message.type === "warning" && "messagesPerField" in kcContext);

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {/* ── Logo ── */}
                <div className={styles.logo}>
                    <div className={styles.logoMark}>SV</div>
                    <span className={styles.logoText}>StackView</span>
                </div>

                {/* ── Card ── */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h1 className={styles.cardTitle}>{headerNode}</h1>
                    </div>

                    {showMessage && (
                        <Alert type={message!.type} summary={message!.summary} />
                    )}

                    {children}

                    {displayInfo && infoNode && (
                        <div className={styles.infoSection}>{infoNode}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Internal alert component ── */

type AlertType = "success" | "warning" | "error" | "info";

function alertClass(type: AlertType): string {
    switch (type) {
        case "error":
            return `${styles.alert} ${styles.alertError}`;
        case "warning":
            return `${styles.alert} ${styles.alertWarning}`;
        case "success":
            return `${styles.alert} ${styles.alertSuccess}`;
        default:
            return `${styles.alert} ${styles.alertInfo}`;
    }
}

function AlertIcon({ type }: { type: AlertType }): ReactNode {
    const icons: Record<AlertType, string> = {
        error: "✕",
        warning: "⚠",
        success: "✓",
        info: "ℹ",
    };
    return <span className={styles.alertIcon}>{icons[type]}</span>;
}

function Alert({ type, summary }: { type: AlertType; summary: string }) {
    return (
        <div className={alertClass(type)} role="alert">
            <AlertIcon type={type} />
            {/* summary can contain keycloak HTML snippets */}
            <span dangerouslySetInnerHTML={{ __html: summary }} />
        </div>
    );
}
