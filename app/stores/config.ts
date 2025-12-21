import { siteConfig, headerConfig, testConfig, appearanceConfig, initLockConfig } from '../configs/config'

export const useConfigs = defineStore('config', () => {

  const obj = {
    siteConfig,
    headerConfig,
    testConfig,
    appearanceConfig,
    initLockConfig
  }

  const configs = reactive(deepClone(obj))

  return configs
}, {
  persist: true,
})
