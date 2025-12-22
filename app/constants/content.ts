/**
 * Content 生成器的默认配置值
 * 用于在未指定参数且未设置环境变量时的回退值
 */
export const CONSTANTS_CONTENT_DEFAULTS = {
  /** 默认索引树文件名前缀 */
  PREFIX_NAME: 'rei',
  /** 默认内容源目录（相对于项目根目录） */
  SOURCE_DIR: 'content',
  /** 默认输出目录（相对于项目根目录） */
  OUTPUT_DIR: 'public/content',
  /** 默认路由基路径 */
  ROUTE_BASE: '/content',
  /** 默认是否在构建前清理输出目录 */
  CLEAN_OUTPUT: true,
} as const

/**
 * Content 生成器的环境变量键名映射
 * 支持多个键名（优先级从左到右）
 */
export const CONSTANTS_CONTENT_ENV_KEYS = {
  /** 索引树文件名前缀的环境变量键名 */
  PREFIX_NAME: ['REI_GLOBAL_PREFIX_NAME', 'REI_PUBLIC_APP_PREFIX_NAME'],
  /** 内容源目录的环境变量键名 */
  SOURCE_DIR: ['REI_CONTENT_SOURCE_DIR', 'REI_PUBLIC_APP_CONTENT_SOURCE_DIR'],
  /** 输出目录的环境变量键名 */
  OUTPUT_DIR: ['REI_CONTENT_OUTPUT_DIR', 'REI_PUBLIC_APP_CONTENT_OUTPUT_DIR'],
  /** 路由基路径的环境变量键名 */
  ROUTE_BASE: ['REI_CONTENT_ROUTE_BASE', 'REI_PUBLIC_APP_CONTENT_ROUTE_BASE'],
  /** 是否清理输出目录的环境变量键名 */
  CLEAN_OUTPUT: ['REI_CONTENT_CLEAN_OUTPUT', 'REI_PUBLIC_APP_CONTENT_CLEAN_OUTPUT'],
} as const

/** 内容索引树文件的后缀名 */
export const CONSTANTS_CONTENT_TREE_FILE_SUFFIX = '_tree.json' as const
