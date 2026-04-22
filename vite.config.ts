import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            themeName: "stackview-kc-theme",
            accountThemeImplementation: "Single-Page"
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
