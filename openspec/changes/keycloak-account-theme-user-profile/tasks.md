## 1. Account Theme Setup

- [x] 1.1 Initialize the Keycloakify account theme and switch the project from `accountThemeImplementation: "none"` to `Single-Page`.
- [x] 1.2 Add the account-theme source tree under `src/account/` and wire the entrypoint to the account UI loader.
- [x] 1.3 Verify the generated theme package can be built for the target Keycloak version.

## 2. Profile Page UI

- [x] 2.1 Add a dedicated `User Profile` route to the account navigation.
- [x] 2.2 Implement the minimal profile form for `firstName`, `lastName`, and `email`.
- [x] 2.3 Render metadata-driven custom attributes, including `bio`, and respect read-only or hidden fields.

## 3. Account API Integration

- [x] 3.1 Add a small Account API client for profile reads and updates.
- [x] 3.2 Load the current profile state on page entry and surface loading/error states.
- [x] 3.3 Submit profile updates through the authenticated Account API and refresh the local state after save.

## 4. Deployment and Realm Enablement

- [x] 4.1 Document the build output and the packaging/deployment path into Keycloak.
- [x] 4.2 Document how to select the custom account theme in Realm Settings.
- [x] 4.3 Add verification notes for a live account-console smoke test after deployment.
