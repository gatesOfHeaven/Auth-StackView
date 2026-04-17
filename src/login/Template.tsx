import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

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
        !(message.type === "warning" && "messagesPerField" in kcContext);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-sm space-y-7">
                {/* ── Logo ── */}
                <div className="flex items-center justify-center gap-2.5">
                    <div className="size-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        SV
                    </div>
                    <span className="text-lg font-semibold text-zinc-900 tracking-tight">
                        StackView
                    </span>
                </div>

                {/* ── Card ── */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>{headerNode}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {showMessage && (
                            <MessageBanner type={message!.type} summary={message!.summary} />
                        )}
                        {children}
                    </CardContent>

                    {displayInfo && infoNode && (
                        <CardFooter className="justify-center border-t pt-4">
                            <p className="text-sm text-muted-foreground">{infoNode}</p>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}

/* ── Inline message banner ── */

type AlertType = "success" | "warning" | "error" | "info";

const alertStyles: Record<AlertType, string> = {
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
};

const alertIcons: Record<AlertType, string> = {
    error: "✕",
    warning: "⚠",
    success: "✓",
    info: "ℹ",
};

function MessageBanner({ type, summary }: { type: AlertType; summary: string }) {
    return (
        <div
            role="alert"
            className={cn(
                "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
                alertStyles[type]
            )}
        >
            <span className="shrink-0 font-semibold leading-5">{alertIcons[type]}</span>
            <span dangerouslySetInnerHTML={{ __html: summary }} />
        </div>
    );
}
