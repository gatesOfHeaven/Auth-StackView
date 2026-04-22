## Why

Keycloak's React-based account console is the right place to manage user profile data, but the default UI does not match the minimal profile-management experience we want to ship. We need a custom account theme that keeps Keycloak's authentication/session behavior intact while exposing a focused profile editor for core and custom attributes.

## What Changes

- Add a custom React-based Account Console theme for Keycloak's account v3 UI.
- Introduce a dedicated `User Profile` page inside the account console navigation.
- Allow users to view and edit `firstName`, `lastName`, and `email`.
- Allow users to edit supported custom attributes such as `bio`, and conditionally editable profile fields such as `username` when realm configuration permits.
- Keep the UI minimal, responsive, and consistent with the existing theme styling system.
- Use the Keycloak Account API for loading profile data and persisting updates.
- Preserve Keycloak's built-in authentication, cookies, and session handling; no custom backend or auth layer is added.

## Capabilities

### New Capabilities
- `account-console-profile-editor`: A custom account-theme capability that provides a dedicated React user profile page backed by the Keycloak Account API.

### Modified Capabilities
- None.

## Impact

- Theme source structure expands to include an account-theme implementation under `src/account/`.
- Keycloakify build configuration changes from login-only to account theme support.
- Generated theme artifacts will need to be packaged for deployment into Keycloak's theme system.
- Realm configuration must be updated to select the custom account theme.
- Account API usage becomes a first-class dependency for profile read/update flows.
