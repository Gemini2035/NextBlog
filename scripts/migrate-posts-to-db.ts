/**
 * 文章迁移：Contentlayer 生成数据 → Prisma Post + PostTag 表
 *
 * 方案概要：
 * 1. 先执行 pnpm contentlayer 生成 .contentlayer/generated/Post/_index.json
 * 2. 本脚本读取该 JSON，映射为 Post 表（id/locale/title/description/date/.../content）与 PostTag 关联
 * 3. 按 (title, locale, date) 匹配已有文章，存在则更新并同步标签，否则创建
 * 4. content 字段存 { raw, code? }，与 getMDXComponent 一致
 *
 * 使用：pnpm contentlayer && pnpm migrate:posts
 * 可选：DRY_RUN=1 仅打印不写入
 *
 * 注意：脚本使用单连接池 (max: 1) 避免默认池导致的 "Connection terminated"。
 */

import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

config({ path: '.env.local' })
config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.Preview_DATABASE_URL ?? process.env.Production_DATABASE_URL ?? ''
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error(
    '❌ 未设置 DATABASE_URL / Preview_DATABASE_URL / Production_DATABASE_URL，请检查 .env.local 或 .env',
  )
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const GENERATED_INDEX = path.join(
  process.cwd(),
  '.contentlayer/generated/Post/_index.json',
)

interface ContentlayerPost {
  slug: string
  locale: string
  title: string
  date: string
  description?: string | null
  tags?: string[]
  formattedTags?: string[]
  published: boolean
  featured: boolean
  updatedAt?: string | null
  originalSlug?: string | null
  body: { raw: string; code?: string }
}

/** 同一天内按毫秒取整，用于匹配 Contentlayer date */
function toDayKey(d: Date): Date {
  const t = new Date(d)
  t.setUTCHours(0, 0, 0, 0)
  return t
}

async function main() {
  const dryRun = process.env.DRY_RUN === '1'

  if (!fs.existsSync(GENERATED_INDEX)) {
    console.error('❌ 未找到 Contentlayer 生成文件，请先执行: pnpm contentlayer')
    process.exit(1)
  }

  if (!dryRun) {
    // 确保 Locale 表中存在基础语言数据，便于后续通过 localeCode 建立外键关系
    const localeConfigs: Array<{ code: string; name: string; isDefault: boolean }> = [
      { code: 'zh', name: '简体中文', isDefault: true },
      { code: 'en', name: 'English', isDefault: false },
      { code: 'ja', name: '日本語', isDefault: false },
    ]

    for (const { code, name, isDefault } of localeConfigs) {
       
      await prisma.locale.upsert({
        where: { code },
        update: {
          name,
          isDefault,
        },
        create: {
          code,
          name,
          isDefault,
        },
      })
    }

    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    if (githubToken) {
      await prisma.thirdPartyConfig.deleteMany({
        where: {
          name: 'github',
        },
      })

      await prisma.thirdPartyConfig.create({
        data: {
          name: 'github',
          value: {
            token: githubToken,
            enabled: true,
            provider: 'github',
            username: 'Gemini2035',
            useMockData: false,
            fetchOptions: {
              repoType: 'all',
              includeForked: true,
              includeArchived: true,
              includeLanguages: true,
              includeContributors: true,
              minStars: 0,
              sortBy: 'updated',
              maxProjects: 100,
              maxPages: 10,
            },
            featuredRepos: ['NextBlog'],
            excludeRepos: [],
            cacheTime: 3600,
          },
        },
      })
    } else {
      console.warn('环境变量 NEXT_PUBLIC_GITHUB_TOKEN 未设置，在迁移脚本中跳过 ThirdPartyConfig.github 初始化。')
    }
  }

  const raw = fs.readFileSync(GENERATED_INDEX, 'utf-8')
  const posts: ContentlayerPost[] = JSON.parse(raw)

  const filtered = posts.filter((p) => p.slug && p.locale && p.body?.raw != null)
  if (filtered.length === 0) {
    console.log('⚠️ 没有可迁移的文章')
    return
  }

  console.log(`📄 共 ${filtered.length} 篇文章待迁移 (dryRun=${dryRun})`)

  if (!dryRun) {
    await prisma.$connect()
  }

  for (const p of filtered) {
    const content = { raw: p.body.raw, ...(p.body.code ? { code: p.body.code } : {}) }
    const postDate = new Date(p.date)
    const tagSource = Array.isArray(p.formattedTags) && p.formattedTags.length > 0 ? p.formattedTags : p.tags
    const tagNames = Array.isArray(tagSource) ? tagSource : []
    const localeCode = p.locale

    const postId = `${p.slug}-${localeCode}`

    if (dryRun) {
      console.log(
        `  [dry] ${localeCode}/${p.slug}`,
        p.title,
        `tags: ${tagNames.join(', ') || '-'}`,
      )
      continue
    }

    const existing = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (existing) {
      await prisma.post.update({
        where: { id: existing.id },
        data: {
          title: p.title,
          description: p.description ?? null,
          date: postDate,
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
          published: p.published !== false,
          featured: p.featured === true,
          localeCode,
          content,
        },
      })

      // 同步标签：先确保 PostTag 实体存在，再重建多对多关联
      if (tagNames.length > 0) {
        for (const name of tagNames) {
           
          await prisma.postTag.upsert({
            where: {
              localeCode_name: {
                localeCode,
                name,
              },
            },
            update: {},
            create: {
              name,
              localeCode,
            },
          })
        }

        await prisma.post.update({
          where: { id: existing.id },
          data: {
            tags: {
              set: tagNames.map((name) => ({
                localeCode_name: {
                  localeCode,
                  name,
                },
              })),
            },
          },
        })
      } else {
        await prisma.post.update({
          where: { id: existing.id },
          data: {
            tags: {
              set: [],
            },
          },
        })
      }

      console.log(`  ✓ [update] ${localeCode}/${p.slug} (id=${existing.id})`)
    } else {
      const created = await prisma.post.create({
        data: {
          id: postId,
          title: p.title,
          description: p.description ?? null,
          date: postDate,
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
          published: p.published !== false,
          featured: p.featured === true,
          localeCode,
          content,
          tags: {
            connectOrCreate: tagNames.map((name) => ({
              where: {
                localeCode_name: {
                  localeCode,
                  name,
                },
              },
              create: {
                name,
                localeCode,
              },
            })),
          },
        },
      })
      console.log(`  ✓ [create] ${localeCode}/${p.slug} (id=${created.id})`)
    }
  }

  if (!dryRun) {
    console.log(`✅ 迁移完成，共 ${filtered.length} 条`)
  }
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
