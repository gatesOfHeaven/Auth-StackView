import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath, URL } from "node:url";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: ["../public"],

    async viteFinal(config) {
        const { mergeConfig } = await import("vite");
        return mergeConfig(config, {
            resolve: {
                alias: {
                    "@": fileURLToPath(new URL("../src", import.meta.url))
                }
            }
        });
    }
};

export default config;
