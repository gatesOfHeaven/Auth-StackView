import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button } from "@/components/ui/button";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type ErrorContext = Extract<KcContext, { pageId: "error.ftl" }>;

export default function Error(props: PageProps<ErrorContext, I18n>) {
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
            <div className="flex flex-col items-center gap-5 py-2 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
                    <span className="text-lg font-bold text-red-500 leading-none">✕</span>
                </div>

                <p
                    className="text-sm text-muted-foreground leading-relaxed max-w-xs"
                    dangerouslySetInnerHTML={{ __html: message.summary }}
                />

                {!skipLink && client?.baseUrl && (
                    <Button variant="outline" asChild className="mt-1">
                        <a href={client.baseUrl}>{msg("backToApplication")}</a>
                    </Button>
                )}
            </div>
        </Template>
    );
}
