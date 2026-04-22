## Context

The repository currently contains a login-theme implementation only. Keycloak's latest account console is React-based and is backed by the Account API, so the custom profile experience should extend the account theme rather than introduce a separate frontend or backend.

The requirement is a minimal profile-management UI for users to edit core identity fields and realm-defined custom attributes while continuing to rely on Keycloak for authentication, cookies, and session lifecycle.

## Goals / Non-Goals

**Goals:**
- Add a custom account-theme implementation that owns the account console UI.
- Provide a single `User Profile` page for editing core and custom profile fields.
- Use the Keycloak Account API for reading and saving profile data.
- Keep the UI intentionally small and easy to maintain.
- Preserve Keycloak-managed authentication and session behavior.

**Non-Goals:**
- Building a separate backend or custom auth service.
- Replacing Keycloak account-session behavior with custom token handling.
- Implementing advanced account features such as devices, sessions, or federated identity management.
- Creating a broad design system overhaul beyond the profile flow.

## Decisions

1. Use the Single-Page account theme implementation.
   - Rationale: Keycloak 25+ ships the React-based account console as the primary account experience, and Keycloakify's Single-Page account support tracks that model closely.
   - Alternatives considered: Multi-Page account theme, which is simpler to customize but is less aligned with the current account console and would diverge from the latest account UI model.

2. Own only the account routes needed for profile editing.
   - Rationale: Ejecting the full account UI increases maintenance cost. Route-level ownership keeps the theme close to upstream while still allowing a custom `User Profile` page.
   - Alternatives considered: Full UI fork, which would maximize control but create unnecessary drift and upgrade burden.

3. Drive fields from account metadata where possible.
   - Rationale: Realm configuration controls which attributes are editable and which are read-only. The UI should mirror that configuration instead of hard-coding all fields.
   - Alternatives considered: Hard-coding the visible fields, which would be simpler but would break parity with realm-level user-profile rules.

4. Use the authenticated Account API for reads and writes.
   - Rationale: This keeps all mutations inside Keycloak's existing session and validation pipeline and avoids building custom endpoints.
   - Alternatives considered: Admin API calls from a backend, which would be more powerful but would violate the frontend-only constraint and expand trust boundaries.

5. Treat `username` as conditional, not universal.
   - Rationale: `username` is often a built-in identity field with realm-specific edit rules. The page should respect whether Keycloak allows it to change.
   - Alternatives considered: Always rendering it as editable, which would create a broken experience in realms that lock it down.

## Risks / Trade-offs

- [Account API shape may vary slightly by Keycloak version] -> Mitigation: keep API access isolated behind a small client layer and verify requests against the stock account console network traffic.
- [Ejecting account routes increases upgrade maintenance] -> Mitigation: own the minimum number of files and keep the rest of the account UI delegated to `@keycloakify/keycloak-account-ui`.
- [Realm-specific profile rules can hide or lock fields unexpectedly] -> Mitigation: render fields from metadata and fail gracefully when a field is not editable.
- [Deploying as a theme JAR is different from a raw `/themes` folder] -> Mitigation: document the build output and deployment path clearly and treat unpacked theme deployment as an alternative packaging step only.

## Migration Plan

1. Initialize the account theme in the existing Keycloakify project.
2. Switch the theme implementation from `none` to `Single-Page` for account support.
3. Add the custom `User Profile` route and the minimal profile form.
4. Verify profile reads and saves against a Keycloak instance with the account console enabled.
5. Build the theme artifact and deploy it to Keycloak.
6. Select the custom account theme in the realm settings and test the live account console.

Rollback strategy:
- Revert the realm's account theme selection to the default account theme.
- Remove the custom theme artifact from the Keycloak deployment if a server-side issue appears.

## Open Questions

- Which Keycloak versions will this deployment target exactly, and should the build emit one JAR or multiple version-specific JARs?
- Should `username` be shown as an editable field only when explicitly writable in metadata, or always shown with a disabled state when read-only?
- Are there any additional realm-specific custom attributes beyond `bio` that need to be prioritized in the first release?
