import { promises as fs } from 'node:fs'
import { join, dirname, extname, resolve, relative, isAbsolute } from 'node:path'
import matter from 'gray-matter'

/**
 * Content 构建映射生成器
 *
 * - Source: `content/**`
 * - Output: `public/content/**`
 * - Markdown: `.md` -> `.json`（Frontmatter + 正文）
 * - Tree Index: `public/content/_{prefix}_tree.json`
 *
 * 约束：输出目录每次构建前都会被清空，确保仅包含本次从 `content/**` 映射生成的产物。
 */

type ContentTreeNode =
  | {
      type: 'dir'
      name: string | undefined
      path: string
      children: ContentTreeNode[]
    }
  | {
      type: 'md'
      name: string | undefined
      path: string
      sourcePath: string
      outputPath: string
      urlPath: string
      meta: {
        title?: string
        date?: string
        description?: string
        tags?: string[]
        cover?: string
      }
    }
  | {
      type: 'file'
      name: string | undefined
      path: string
      sourcePath: string
      outputPath: string
      urlPath: string
    }

/** Windows 路径分隔符归一化为 POSIX，以便索引树跨平台一致。 */
const toPosixPath = (p: string) => p.replaceAll('\\', '/')

/**
 * 生成索引文件名用的 prefix 清洗：只允许字母数字、下划线、短横线。
 * 其余字符会被替换为 `_`。
 */
const sanitizePrefix = (prefix: string) => prefix.trim().replaceAll(/[^a-zA-Z0-9_-]+/g, '_')

/**
 * 路由前缀归一化：
 * - 以 `/` 开头
 * - 不以 `/` 结尾（根路径除外）
 */
const normalizeRouteBase = (routeBase: string) => {
  const trimmed = routeBase.trim() || '/content'
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (withSlash !== '/' && withSlash.endsWith('/')) return withSlash.slice(0, -1)
  return withSlash
}

const isWithin = (baseDirAbs: string, targetAbs: string) => {
  const rel = relative(baseDirAbs, targetAbs)
  return rel !== '' && !rel.startsWith('..') && !rel.startsWith('..\\') && !isAbsolute(rel)
}

const resolveSafeProjectDir = (cwd: string, dirPath: string) => {
  if (!dirPath) throw new Error('[gen-content] dirPath is required')
  if (isAbsolute(dirPath)) throw new Error(`[gen-content] Absolute paths are not allowed: ${dirPath}`)

  const abs = resolve(cwd, dirPath)
  if (!isWithin(cwd, abs)) throw new Error(`[gen-content] Path must be within project root: ${dirPath}`)
  return abs
}

const toUrlPath = (routeBase: string, relPosixPath: string) => {
  const rel = relPosixPath.replace(/^\/+/, '')
  return rel ? `${routeBase}/${rel}` : routeBase
}

const getTreePrefix = (env: NodeJS.ProcessEnv) => {
  const prefixRaw = env.REI_PUBLIC_APP_PREFIX_NAME || env.REI_PUBLIC_APP_PREFIX_NAME || 'global'
  return sanitizePrefix(prefixRaw) || 'global'
}

const getContentSourceDir = (env: NodeJS.ProcessEnv) => (env.REI_PUBLIC_APP_CONTENT_SOURCE_DIR || 'content').trim() || 'content'

const getContentOutputDir = (env: NodeJS.ProcessEnv) => (env.REI_PUBLIC_APP_CONTENT_OUTPUT_DIR || 'public/content').trim() || 'public/content'

const getContentRouteBase = (env: NodeJS.ProcessEnv) => normalizeRouteBase(env.REI_PUBLIC_APP_CONTENT_ROUTE_BASE || '/content')

const getCleanOutput = (env: NodeJS.ProcessEnv) => {
  const raw = (env.REI_PUBLIC_APP_CONTENT_CLEAN_OUTPUT || 'true').trim().toLowerCase()
  return raw !== 'false' && raw !== '0'
}

const formatFrontmatterMeta = (data: Record<string, unknown> | undefined) => {
  const title = data?.title ? String(data.title) : undefined
  const date = normalizeDate(data?.date)
  const description = data?.description ? String(data.description) : undefined
  const tags = normalizeTags(data?.tags)
  const cover = data?.cover ? String(data.cover) : undefined

  return { title, date, description, tags, cover }
}

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true })
}

const ensureParentDir = async (filePath: string) => {
  await ensureDir(dirname(filePath))
}

const safeReadDir = async (dirPath: string) => {
  try {
    return await fs.readdir(dirPath, { withFileTypes: true })
  } catch {
    return []
  }
}

const rmDirIfExists = async (dirPath: string) => {
  await fs.rm(dirPath, { recursive: true, force: true })
}

const normalizeTags = (tags: unknown): string[] | undefined => {
  if (!tags) return undefined
  if (Array.isArray(tags)) return tags.map(v => String(v)).filter(Boolean)
  if (typeof tags === 'string') {
    const value = tags.trim()
    if (!value) return undefined
    return value.split(',').map(s => s.trim()).filter(Boolean)
  }
  return [String(tags)]
}

const normalizeDate = (date: unknown): string | undefined => {
  if (!date) return undefined
  if (date instanceof Date) return date.toISOString()
  return String(date)
}


/**
 * 生成内容索引树
 * 
 * 1. 读取内容源目录下的所有文件和子目录
 * 2. 构建目录树结构
 * 3. 生成 JSON 文件到输出目录
 * 4. 写入索引树文件到输出目录
 * 
 * 注意：
 * - 索引树文件名格式为 `_${prefix}_tree.json`
 * - 索引树文件会被写入到 `outputDir` 目录下
 * - 索引树文件的 URL 路径为 `${routeBase}/${prefix}_tree.json`
 * 
 * env config:
 * - REI_PUBLIC_APP_PREFIX_NAME: 索引树文件名前缀（默认：'rei'）
 * - REI_PUBLIC_APP_CONTENT_SOURCE_DIR: 内容源目录（默认：'content'）
 * - REI_PUBLIC_APP_CONTENT_OUTPUT_DIR: 输出目录（默认：'public/content'）
 * - REI_PUBLIC_APP_CONTENT_ROUTE_BASE: 路由前缀（默认：'/content'）
 */
export async function generateContent() {
  const cwd = process.cwd()
  const sourceDir = getContentSourceDir(process.env)
  const outputDir = getContentOutputDir(process.env)
  const routeBase = getContentRouteBase(process.env)
  const cleanOutput = getCleanOutput(process.env)

  const sourceRoot = resolveSafeProjectDir(cwd, sourceDir)
  const outputRoot = resolveSafeProjectDir(cwd, outputDir)

  const publicRoot = resolve(cwd, 'public')
  if (!isWithin(publicRoot, outputRoot)) {
    throw new Error(`[gen-content] outputDir must be inside \'public\': ${outputDir}`)
  }
  if (outputRoot === publicRoot) {
    throw new Error(`[gen-content] outputDir must not be \'public\' root: ${outputDir}`)
  }

  if (cleanOutput) await rmDirIfExists(outputRoot)
  await ensureDir(outputRoot)

  const prefix = getTreePrefix(process.env)
  const treeFileName = `_${prefix}_tree.json`
  const treeOutputPath = join(outputRoot, treeFileName)

  const sourceDirPosix = toPosixPath(sourceDir)
  const outputDirPosix = toPosixPath(outputDir)
  const treeUrlPath = toUrlPath(routeBase, treeFileName)
  const rootName = sourceDirPosix.split('/').filter(Boolean).slice(-1)[0] || 'content'

  const buildDirNode = (relDirPosix: string, children: ContentTreeNode[]): ContentTreeNode => {
    return {
      type: 'dir',
      name: relDirPosix ? relDirPosix.split('/').slice(-1)[0] : rootName,
      path: relDirPosix,
      children,
    }
  }

  const walk = async (dirPath: string, relDirPosix: string): Promise<ContentTreeNode> => {
    const entries = await safeReadDir(dirPath)
    const children: ContentTreeNode[] = []

    const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name))
    for (const entry of sorted) {
      const abs = join(dirPath, entry.name)
      const relPosix = relDirPosix ? `${relDirPosix}/${entry.name}` : entry.name
      const relPosixNormalized = toPosixPath(relPosix)

      if (entry.isDirectory()) {
        const childDir = await walk(abs, relPosixNormalized)
        children.push(childDir)
        continue
      }

      const ext = extname(entry.name).toLowerCase()
      if (ext === '.md') {
        const raw = await fs.readFile(abs, 'utf-8')
        const parsed = matter(raw)
        const outRel = relPosixNormalized.replace(/\.md$/i, '.json')
        const outAbs = join(outputRoot, outRel)

        const meta = formatFrontmatterMeta(parsed.data as any)

        const json = {
          ...meta,
          content: parsed.content.replaceAll('\r\n', '\n'),
        }

        await ensureParentDir(outAbs)
        await fs.writeFile(outAbs, JSON.stringify(json, null, 2), 'utf-8')

        children.push({
          type: 'md',
          name: entry.name,
          path: relPosixNormalized,
          sourcePath: `${sourceDirPosix}/${relPosixNormalized}`,
          outputPath: `${outputDirPosix}/${toPosixPath(outRel)}`,
          urlPath: toUrlPath(routeBase, toPosixPath(outRel)),
          meta,
        })
        continue
      }

      const outAbs = join(outputRoot, relPosixNormalized)
      await ensureParentDir(outAbs)
      await fs.copyFile(abs, outAbs)

      children.push({
        type: 'file',
        name: entry.name,
        path: relPosixNormalized,
        sourcePath: `${sourceDirPosix}/${relPosixNormalized}`,
        outputPath: `${outputDirPosix}/${relPosixNormalized}`,
        urlPath: toUrlPath(routeBase, relPosixNormalized),
      })
    }

    return buildDirNode(relDirPosix, children)
  }

  const tree = await walk(sourceRoot, '')
  const index = {
    prefix,
    routeBase,
    sourceDir: sourceDirPosix,
    outputDir: outputDirPosix,
    generatedAt: new Date().toISOString(),
    treeUrlPath,
    tree,
  }

  await ensureParentDir(treeOutputPath)
  await fs.writeFile(treeOutputPath, JSON.stringify(index, null, 2), 'utf-8')
}
