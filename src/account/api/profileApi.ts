import {
    getPersonalInfo,
    getSupportedLocales,
    savePersonalInfo,
} from "./methods";
import type { Environment } from "../environment";
import type { KcContext } from "../KcContext";
import type { UserRepresentation } from "./representations";

type AccountContext = Extract<KcContext, { pageId: "account.ftl" }>;

export async function loadUserProfile(
    context: AccountContext & { environment: Environment },
    signal: AbortSignal
): Promise<{ personalInfo: UserRepresentation; supportedLocales: string[] }> {
    const [personalInfo, supportedLocales] = await Promise.all([
        getPersonalInfo({ signal, context }),
        getSupportedLocales({ signal, context }),
    ]);

    return { personalInfo, supportedLocales };
}

export async function updateUserProfile(
    context: AccountContext & { environment: Environment },
    user: UserRepresentation
): Promise<void> {
    await savePersonalInfo(context, user);
}
