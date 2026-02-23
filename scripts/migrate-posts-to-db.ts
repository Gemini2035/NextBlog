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
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })
config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.Preview_DATABASE_URL ?? process.env.Production_DATABASE_URL ?? ''
}
if (!process.env.DATABASE_URL) {
  console.error('❌ 未设置 DATABASE_URL / Preview_DATABASE_URL / Production_DATABASE_URL，请检查 .env.local 或 .env')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000,
})
const adapter = new PrismaPg(pool, { disposeExternalPool: false })
const prisma = new PrismaClient({ adapter })

const GENERATED_INDEX = path.join(
  process.cwd(),
  '.contentlayer/generated/Post/_index.json'
)

interface ContentlayerPost {
  slug: string
  locale: string
  title: string
  date: string
  description?: string | null
  tags?: string[]
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

  type PostTagDelegate = { deleteMany: (args: { where: { postId: string } }) => Promise<unknown>; create: (args: { data: { postId: string; name: string } }) => Promise<unknown> }
  const db = prisma as unknown as { post: typeof prisma.post; postTag: PostTagDelegate }

  for (const p of filtered) {
    const content = { raw: p.body.raw, ...(p.body.code ? { code: p.body.code } : {}) }
    const postDate = new Date(p.date)
    const tagNames = Array.isArray(p.tags) ? p.tags : []

    const payload = {
      locale: p.locale,
      title: p.title,
      description: p.description ?? null,
      date: postDate,
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
      published: p.published !== false,
      featured: p.featured === true,
      content,
    }

    if (dryRun) {
      console.log(`  [dry] ${p.locale}/${p.slug}`, payload.title, `tags: ${tagNames.join(', ') || '-'}`)
      continue
    }

    const dayStart = toDayKey(postDate)
    const dayEnd = new Date(dayStart)
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1)

    const existing = await prisma.post.findFirst({
      where: {
        title: p.title,
        locale: p.locale,
        date: { gte: dayStart, lt: dayEnd },
      },
    })

    if (existing) {
      await prisma.post.update({
        where: { id: existing.id },
        data: payload,
      })
      await db.postTag.deleteMany({ where: { postId: existing.id } })
      for (const name of tagNames) {
        await db.postTag.create({ data: { postId: existing.id, name } })
      }
      console.log(`  ✓ [update] ${p.locale}/${p.slug} (id=${existing.id})`)
    } else {
      const created = await prisma.post.create({ data: payload as unknown as Parameters<typeof prisma.post.create>[0]['data'] })
      for (const name of tagNames) {
        await db.postTag.create({ data: { postId: created.id, name } })
      }
      console.log(`  ✓ [create] ${p.locale}/${p.slug} (id=${created.id})`)
    }
  }

  if (!dryRun) {
    console.log(`✅ 迁移完成，共 ${filtered.length} 条`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
