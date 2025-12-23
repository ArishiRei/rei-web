import { generateContent, generateCSS, readEnvString, readEnvBool } from "./app/hooks";
import { CONSTANTS_CONTENT_DEFAULTS, CONSTANTS_CONTENT_ENV_KEYS } from "./app/constants/content";

/**
 * @file nuxt.config.ts
 * @description Nuxt 核心配置文件
 */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: [
    "./app/assets/styles/theme.css",
    "./app/assets/styles/global.css",
  ],

  vite: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith("md-"),
        },
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

  components: [
    {
      path: "components/base",
      pathPrefix: false, // 禁用路径前缀，直接使用组件名 (e.g. ReiButton)
    },
    {
      path: "components/domain",
      pathPrefix: false,
    },
    {
      path: "components/layout",
      pathPrefix: false,
    },
    {
      path: "components/ui",
      pathPrefix: false,
    },
    "components", // 保留默认行为，处理其他组件
  ],

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

  runtimeConfig: {
    public: {
      apiBase: process.env.REI_PUBLIC_API_BASE || "",
    },
  },

  // dev server config
  devServer: {
    port: process.env.REI_PUBLIC_APP_PORT
      ? parseInt(process.env.REI_PUBLIC_APP_PORT)
      : 3000,
    host: process.env.REI_PUBLIC_APP_ADDR || "localhost",
  },

  spaLoadingTemplate: false, // 禁用默认 SPA loading，使用 app.html 中的自定义内容
});