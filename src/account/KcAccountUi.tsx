import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";

import { KeycloakProvider } from "@keycloakify/keycloak-ui-shared/keycloak-theme/shared/keycloak-ui-shared";
import { environment } from "./environment";
import { Root } from "./root/Root";

export default function KcAccountUi() {
    return (
        <KeycloakProvider environment={environment}>
            <Root />
        </KeycloakProvider>
    );
}
