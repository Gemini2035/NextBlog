import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, getPostBySlugAndLocale } from '@/lib/posts-adapter'
import type { PostDetail } from '../types'

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/posts/[slug]
 * 数据来源：项目文件夹（Contentlayer），非数据库
 * 查询参数: locale (可选) - zh | en | ja，不传则返回该 slug 任意 locale 的第一条
 * 返回单篇文章（含正文 bodyRaw）
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') ?? undefined
    console.log('[api] GET /api/posts/%s?locale=%s', slug, locale ?? '')

    const post = locale
      ? getPostBySlugAndLocale(slug, locale)
      : getPostBySlug(slug)

    if (!post || post.published === false) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    const body: PostDetail = {
      id: post._id,
      slug: post.slug,
      locale: post.locale,
      title: post.title,
      description: post.description ?? null,
      date: post.date,
      updatedAt: post.updatedAt ?? null,
      published: post.published,
      featured: post.featured,
      tags: post.tags ?? [],
      originalSlug: post.originalSlug ?? null,
      url: post.url,
      bodyRaw: post.body?.raw ?? '',
      bodyCode: post.body?.code,
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error('[api/posts/[slug]]', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}
