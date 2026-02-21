import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/posts
 * 数据来源：Prisma 数据库，通过文章 id 精准定位
 * 查询参数: locale (可选) - zh | en | ja
 * 返回已发布文章列表（不含正文），按日期倒序
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') ?? undefined
    const id = searchParams.get('id') ?? undefined
    console.log('[api] GET /api/posts?locale=%s&id=%s', locale ?? '', id ?? '')

    const post = await prisma.post.findUnique({
      where: {
        published: true,
        locale,
        id,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('[api/posts]', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}
