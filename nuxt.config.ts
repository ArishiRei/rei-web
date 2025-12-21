import { generateContent, generateCSS } from './app/hooks'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true }) as any,
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["node"]
      }
    }
  },

  // hook
  hooks: {
    'build:before': async () => {
      await generateContent() // 生成content file为静态
      await generateCSS() // 生成自定义css
    }
  },

  imports: {
    dirs: ['types', 'constants'],
  },


  // modules
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
  ],

  pinia: {
    storesDirs: ['./stores/**'],
  },

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'zh', file: 'zh.json', name: '中文' }
    ],
    // lazy: true,
    langDir: '../app/i18n/locales',
    defaultLocale: 'zh',
    strategy: 'prefix_except_default', // /zh for Chinese, / for English
  },

  // dev server config
  devServer: {
    port: process.env.REI_PUBLIC_APP_PORT ? parseInt(process.env.REI_PUBLIC_APP_PORT) : 3000,
    host: process.env.REI_PUBLIC_APP_ADDR || 'localhost',
  },
})
