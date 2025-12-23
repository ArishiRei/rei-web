/**
 * @file app/stores/config.ts
 * @description 应用全局配置状态管理
 */
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
