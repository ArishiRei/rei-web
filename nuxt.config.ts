import { generateContent, generateCSS, readEnvString, readEnvBool } from "./app/hooks";
import { CONSTANTS_CONTENT_DEFAULTS, CONSTANTS_CONTENT_ENV_KEYS } from "./app/constants/content";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true })
    ],
    // plugins: [vuetify({ autoImport: true }) as any],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },

  // hook
  hooks: {
    "build:before": async () => {
      await generateContent({
        prefix: readEnvString(
          process.env,
          CONSTANTS_CONTENT_ENV_KEYS.PREFIX_NAME,
          CONSTANTS_CONTENT_DEFAULTS.PREFIX_NAME
        ),
        sourceDir: readEnvString(
          process.env,
          CONSTANTS_CONTENT_ENV_KEYS.SOURCE_DIR,
          CONSTANTS_CONTENT_DEFAULTS.SOURCE_DIR
        ),
        outputDir: readEnvString(
          process.env,
          CONSTANTS_CONTENT_ENV_KEYS.OUTPUT_DIR,
          CONSTANTS_CONTENT_DEFAULTS.OUTPUT_DIR
        ),
        routeBase: readEnvString(
          process.env,
          CONSTANTS_CONTENT_ENV_KEYS.ROUTE_BASE,
          CONSTANTS_CONTENT_DEFAULTS.ROUTE_BASE
        ),
        cleanOutput: readEnvBool(
          process.env,
          CONSTANTS_CONTENT_ENV_KEYS.CLEAN_OUTPUT,
          CONSTANTS_CONTENT_DEFAULTS.CLEAN_OUTPUT
        ),
      });
      await generateCSS(); // 生成自定义css
    },
  },

  imports: {
    dirs: ["types", "constants"],
  },

  // modules
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
  ],

  eslint: {
    config: {
      standalone: false,
    },
  },

  pinia: {
    storesDirs: ["./stores/**"],
  },

  i18n: {
    locales: [
      { code: "en", file: "en.json", name: "English" },
      { code: "zh", file: "zh.json", name: "中文" },
    ],
    langDir: "../app/i18n/locales",
    defaultLocale: "zh",
    strategy: "prefix_except_default", // /zh for Chinese, / for English
  },

  // dev server config
  devServer: {
    port: process.env.REI_PUBLIC_APP_PORT
      ? parseInt(process.env.REI_PUBLIC_APP_PORT)
      : 3000,
    host: process.env.REI_PUBLIC_APP_ADDR || "localhost",
  },
});