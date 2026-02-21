import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts-adapter'
import type { PostListItem } from './types'

/**
 * GET /api/posts
 * 数据来源：项目文件夹（Contentlayer），非数据库
 * 查询参数: locale (可选) - zh | en | ja
 * 返回已发布文章列表（不含正文），按日期倒序
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') ?? undefined
    console.log('[api] GET /api/posts?locale=%s', locale ?? '')

    const list = getAllPosts(locale ?? undefined)

    const posts: PostListItem[] = list.map((p) => ({
      id: p._id,
      slug: p.slug,
      locale: p.locale,
      title: p.title,
      description: p.description ?? null,
      date: p.date,
      updatedAt: p.updatedAt ?? null,
      published: p.published,
      featured: p.featured,
      tags: p.tags ?? [],
      originalSlug: p.originalSlug ?? null,
      url: p.url,
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
