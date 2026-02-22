import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/api/_prisma'
import type { PostListItem } from './types'

/**
 * GET /api/posts
 * 获取文章列表，支持按 locale 筛选
 * 查询参数: locale (可选) - zh | en | ja
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') ?? undefined

    const list = await prisma.post.findMany({
      where: {
        published: true,
        ...(locale ? { locale } : {}),
      },
      orderBy: { date: 'desc' },
    })

    const posts: PostListItem[] = list.map((p) => ({
      id: p.id,
      slug: p.slug,
      locale: p.locale,
      title: p.title,
      description: p.description ?? null,
      date: p.date.toISOString(),
      updatedAt: p.updatedAt?.toISOString() ?? null,
      published: p.published,
      featured: p.featured,
      tags: p.tags ?? [],
      originalSlug: p.originalSlug ?? null,
      url: `/${p.locale}/posts/${p.id}`,
    }))

    return NextResponse.json(posts)
  } catch (error) {
    console.error('[api/posts]', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}
