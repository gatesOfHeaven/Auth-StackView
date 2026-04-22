## ADDED Requirements

### Requirement: Custom account profile page
The account theme MUST provide a dedicated `User Profile` page in the account console navigation when the custom account theme is selected.

#### Scenario: User opens profile page
- **WHEN** the user navigates to the account console with the custom account theme enabled
- **THEN** the console SHALL expose a `User Profile` page as part of the account UI

### Requirement: Editable core profile fields
The `User Profile` page MUST display and allow editing of `firstName`, `lastName`, and `email`.

#### Scenario: User edits core profile data
- **WHEN** the user changes their first name, last name, or email and submits the form
- **THEN** the updated values SHALL be persisted through the account profile update flow

### Requirement: Editable custom attributes
The `User Profile` page MUST display user profile attributes that are enabled by realm configuration and allow editing of supported custom attributes such as `bio`.

#### Scenario: User edits a custom attribute
- **WHEN** the realm exposes a custom attribute such as `bio`
- **THEN** the page SHALL render the attribute and allow the user to update it

### Requirement: Realm-aware username editing
The `User Profile` page MUST only allow editing of `username` when the realm user-profile configuration permits it.

#### Scenario: Username is not editable
- **WHEN** the realm configuration marks `username` as read-only or unavailable
- **THEN** the page SHALL hide or disable the `username` field

### Requirement: Account API profile persistence
The account theme MUST use the Keycloak Account API to load and persist profile data.

#### Scenario: Profile save request
- **WHEN** the user saves changes from the `User Profile` page
- **THEN** the theme SHALL submit the update through the authenticated Account API and reflect the saved state in the UI

### Requirement: Session-preserving theme
The custom account theme MUST preserve Keycloak authentication and session handling.

#### Scenario: Existing account session
- **WHEN** the user is already signed in to Keycloak
- **THEN** the custom account theme SHALL reuse the existing Keycloak session without requiring a separate login flow
