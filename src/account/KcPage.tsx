import { lazy } from "react";
import { KcAccountUiLoader } from "@keycloakify/keycloak-account-ui";
import type { KcContext } from "./KcContext";

const KcAccountUi = lazy(() => import("./KcAccountUi"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    // Keycloak v25 doesn't include referrerName in the account context unless an app
    // explicitly configures a referrer. The loader treats undefined values as missing
    // polyfills and logs an error, so we default to "" to signal "no referrer".
    const kcContextPolyfilled = {
        ...kcContext,
        referrerName: kcContext.referrerName ?? ""
    };

    return <KcAccountUiLoader kcContext={kcContextPolyfilled} KcAccountUi={KcAccountUi} />;
}
