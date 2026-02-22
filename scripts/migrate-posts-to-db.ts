/**
 * 文章迁移：Contentlayer 生成数据 → Prisma Post 表
 *
 * 方案概要：
 * 1. 先执行 pnpm contentlayer 生成 .contentlayer/generated/Post/_index.json
 * 2. 本脚本读取该 JSON，按 (slug, locale) 映射为 Post 表结构
 * 3. 使用 upsert(slug+locale) 写入数据库，避免重复、支持重复执行
 * 4. content 字段存 { raw, code? }，与 API/详情页 getMDXComponent 一致
 *
 * 使用：pnpm contentlayer && pnpm migrate:posts
 * 可选：DRY_RUN=1 仅打印不写入
 */

import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { prisma } from '../src/app/api/_prisma'

config({ path: '.env.local' })
config({ path: '.env' })

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

  for (const p of filtered) {
    const content = { raw: p.body.raw, ...(p.body.code ? { code: p.body.code } : {}) }
    const payload = {
      slug: p.slug,
      locale: p.locale,
      title: p.title,
      description: p.description ?? null,
      date: new Date(p.date),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
      published: p.published !== false,
      featured: p.featured === true,
      tags: Array.isArray(p.tags) ? p.tags : [],
      originalSlug: p.originalSlug ?? null,
      content,
    }

    if (dryRun) {
      console.log(`  [dry] ${p.locale}/${p.slug}`, payload.title)
      continue
    }

    await prisma.post.upsert({
      where: {
        slug_locale: { slug: p.slug, locale: p.locale },
      },
      create: payload,
      update: payload,
    })
    console.log(`  ✓ ${p.locale}/${p.slug}`)
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
  .finally(() => prisma.$disconnect())
