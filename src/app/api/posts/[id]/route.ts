import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../_prisma'
import type { PostDetail, PostContentShape } from '../types'

/**
 * GET /api/posts/[id]
 * 通过文章 id 精准定位（一个 id 唯一对应一篇 post）
 * 返回单篇详情（含 bodyRaw、bodyCode）
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    console.log('[api] GET /api/posts/%s', id)

    const row = await prisma.post.findUnique({
      where: { id },
    })

    if (!row || !row.published) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }

    const content = row.content as PostContentShape | null
    const bodyRaw = content?.raw ?? ''
    const bodyCode = content?.code

    const post: PostDetail = {
      id: row.id,
      slug: row.slug,
      locale: row.locale,
      title: row.title,
      description: row.description ?? null,
      date: row.date.toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? null,
      published: row.published,
      featured: row.featured,
      tags: row.tags ?? [],
      originalSlug: row.originalSlug ?? null,
      url: `/${row.locale}/posts/${row.id}`,
      bodyRaw,
      ...(bodyCode !== undefined ? { bodyCode } : {}),
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('[api/posts/[id]]', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}
