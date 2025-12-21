export interface ConfigType {
  title: string
  description: string
  version: string
  features: {
    blog: boolean
    demo: boolean
  }
  router: {
    navbar: Array<AppConfigNavbar>
  }
}

export type I18nLocales =
| 'zh'
| 'en'

export interface AppConfigNavbar {
  path: string
  title: string
}