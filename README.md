<p align="center">
    <i>🚀 <a href="https://keycloakify.dev">Keycloakify</a> v11 starter 🚀</i>
    <br/>
    <br/>
</p>

# Quick start

```bash
git clone https://github.com/keycloakify/keycloakify-starter
cd keycloakify-starter
yarn install # Or use an other package manager, just be sure to delete the yarn.lock if you use another package manager.
```

# Testing the theme locally

[Documentation](https://docs.keycloakify.dev/testing-your-theme)

# How to customize the theme

[Documentation](https://docs.keycloakify.dev/css-customization)

# Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).  
The `mvn` command must be in the $PATH.

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

```bash
npm run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.  
You can customize this behavior, see documentation [here](https://docs.keycloakify.dev/features/compiler-options/keycloakversiontargets).

For this project the account theme is initialized as a React-based Single-Page account console. The build produces theme JARs in `dist_keycloak/`, including `keycloak-theme-for-kc-all-other-versions.jar` for Keycloak 26+.

# Initializing the account theme

```bash
npx keycloakify initialize-account-theme
```

The account theme is already initialized in this repository. The important files live under `src/account/`, with the account shell wired through `src/kc.gen.tsx`.

## Deploying the account theme

1. Copy the generated JAR from `dist_keycloak/` into Keycloak's providers directory, for example `/opt/keycloak/providers/`.
2. Rebuild the Keycloak server image or run `bin/kc.sh build` if you are using an existing installation.
3. Start Keycloak and verify the custom account theme appears in the realm theme picker.

## Enabling the theme

1. Open the Admin Console.
2. Select the target realm.
3. Go to `Realm Settings` > `Themes`.
4. Set `Account Theme` to `stackview-kc-theme`.
5. Save, then open `/realms/<realm>/account` to verify the custom `User Profile` page.

# Initializing the email theme

```bash
npx keycloakify initialize-email-theme
```

# GitHub Actions

The starter comes with a generic GitHub Actions workflow that builds the theme and publishes
the jars [as GitHub releases artifacts](https://github.com/keycloakify/keycloakify-starter/releases/tag/v10.0.0).  
To release a new version **just update the `package.json` version and push**.

To enable the workflow go to your fork of this repository on GitHub then navigate to:
`Settings` > `Actions` > `Workflow permissions`, select `Read and write permissions`.
