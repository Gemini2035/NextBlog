// Posts 适配器 - 为服务器组件提供 posts 功能
import { IBlogPost } from '@/types'
import { prisma } from '@/lib/prisma'

export async function getAllPosts(locale?: string): Promise<IBlogPost[]> {
  const rows = await prisma.post.findMany({
    where: { published: true, locale },
  })
  return rows as IBlogPost[]
}

export async function getPostById(id: string): Promise<IBlogPost | null> {
  const row = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  })
  const post = {
    ...row,
    tags: row?.tags.map((t) => t.name),
  } as IBlogPost | null
  return post
}

export async function getRelatedPosts(
  post: Pick<IBlogPost, 'locale' | 'id'>,
  limit: number = 3
): Promise<IBlogPost[]> {
  const rows = await prisma.post.findMany({
    where: { published: true, locale: post.locale, id: { not: post.id } },
    take: limit,
    include: { tags: true },
  })
  return rows.map((row) => {
    const post = {
      ...row,
      tags: row?.tags.map((t) => t.name),
    } as IBlogPost
    return post
  })
}

export async function getPostsByTag(tag: string, locale?: string): Promise<IBlogPost[]> {
  const rows = await prisma.post.findMany({
    where: {
      published: true,
      ...(locale ? { locale } : {}),
      tags: { some: { name: tag } },
    },
    orderBy: { date: 'desc' },
    include: { tags: true },
  })
  return rows.map((row) => {
    const post = {
      ...row,
      tags: row?.tags.map((t) => t.name),
    } as IBlogPost
    return post
  })
}

export async function getAllTags(): Promise<string[]> {
  const result = await prisma.postTag.groupBy({
    by: ['name'],
    _count: {},
  })
  return result.map((r) => r.name).sort()
}

// 获取置顶文章（单篇，向后兼容）
export async function getFeaturedPost(locale?: string): Promise<IBlogPost | undefined> {
  const posts = await getFeaturedPosts(locale)
  return posts[0]
}

// 获取所有置顶文章
export async function getFeaturedPosts(locale?: string): Promise<IBlogPost[]> {
  const rows = await prisma.post.findMany({
    where: { published: true, featured: true, locale },
    include: { tags: true },
  })
  return rows.map((row) => {
    const post = {
      ...row,
      tags: row?.tags.map((t) => t.name),
    } as IBlogPost
    return post
  })
}

// 获取最近一个月更新的文章（最多10篇）
export async function getRecentPosts(locale?: string): Promise<IBlogPost[]> {
  const rows = await prisma.post.findMany({
    where: {
      published: true,
      locale,
      updatedAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: { tags: true },
  })
  return rows.map((row) => {
    const post = {
      ...row,
      tags: row?.tags.map((t) => t.name),
    } as IBlogPost
    return post
  })
}
