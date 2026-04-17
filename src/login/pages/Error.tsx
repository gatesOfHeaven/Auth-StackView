import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import styles from "./Error.module.css";

type ErrorContext = Extract<KcContext, { pageId: "error.ftl" }>;

export default function Error(
    props: PageProps<ErrorContext, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div className={styles.body}>
                <div className={styles.iconWrap}>
                    <span className={styles.icon}>✕</span>
                </div>

                <p
                    className={styles.message}
                    dangerouslySetInnerHTML={{ __html: message.summary }}
                />

                {!skipLink && client?.baseUrl && (
                    <a href={client.baseUrl} className={styles.backLink}>
                        {msg("backToApplication")}
                    </a>
                )}
            </div>
        </Template>
    );
}
