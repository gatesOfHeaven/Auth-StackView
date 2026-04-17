import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import styles from "./Info.module.css";

type InfoContext = Extract<KcContext, { pageId: "info.ftl" }>;

export default function Info(
    props: PageProps<InfoContext, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const {
        message,
        requiredActions,
        skipLink,
        pageRedirectUri,
        actionUri,
        client,
    } = kcContext;

    const { msg, advancedMsg, advancedMsgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={advancedMsg("infoHeader")}
        >
            <div className={styles.body}>
                <div className={styles.iconWrap}>
                    <span className={styles.icon}>ℹ</span>
                </div>

                <p
                    className={styles.message}
                    dangerouslySetInnerHTML={{ __html: message.summary }}
                />

                {/* ── Required actions list ── */}
                {requiredActions && requiredActions.length > 0 && (
                    <ul className={styles.actionList}>
                        {requiredActions.map(action => (
                            <li key={action} className={styles.actionItem}>
                                {advancedMsgStr(`requiredAction.${action}`)}
                            </li>
                        ))}
                    </ul>
                )}

                {/* ── Navigation links ── */}
                {!skipLink && (
                    <div className={styles.links}>
                        {pageRedirectUri ? (
                            <a href={pageRedirectUri} className={styles.primaryLink}>
                                {msg("backToApplication")}
                            </a>
                        ) : actionUri ? (
                            <a href={actionUri} className={styles.primaryLink}>
                                {advancedMsg("proceedWithAction")}
                            </a>
                        ) : client?.baseUrl ? (
                            <a href={client.baseUrl} className={styles.primaryLink}>
                                {msg("backToApplication")}
                            </a>
                        ) : null}
                    </div>
                )}
            </div>
        </Template>
    );
}
