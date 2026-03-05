import { Prisma } from '@prisma/client'
import { prisma } from '@/server/prisma'

type GraphQLContext = {
  locale: string
}

function mapRowToPost(
  row: Prisma.PostGetPayload<{
    include: { tags: true }
  }>
) {
  return {
    id: row.id,
    locale: row.localeCode,
    title: row.title,
    description: row.description ?? null,
    date: row.date.toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? null,
    published: row.published,
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
    tags: row.tags.map((t) => t.name),
    content: row.content ? JSON.stringify(row.content) : null,
  }
}

export const postResolvers = {
  async post(_: unknown, { id }: { id: string }) {
    const row = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!row) return null
    return mapRowToPost(row)
  },
  async relatedPosts(
    _: unknown,
    { id, limit }: { id: string; limit: number },
    context: GraphQLContext
  ) {
    const rows = await prisma.post.findMany({
      where: {
        published: true,
        locale: {
          code: context.locale,
        },
        id: { not: id },
      },
      take: limit,
      include: { tags: true },
    })
    return rows.map(mapRowToPost)
  },
  async featuredPosts(
    _: unknown,
    _args: Record<string, never>,
    context: GraphQLContext
  ) {
    const rows = await prisma.post.findMany({
      where: {
        published: true,
        featured: true,
        locale: {
          code: context.locale,
        },
      },
      include: { tags: true },
    })
    return rows.map(mapRowToPost)
  },
  async recentPosts(
    _: unknown,
    { limit = 10 }: { limit?: number },
    context: GraphQLContext
  ) {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const rows = await prisma.post.findMany({
      where: {
        published: true,
        locale: {
          code: context.locale,
        },
        updatedAt: { gte: since },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { tags: true },
    })
    return rows.map(mapRowToPost)
  },
  async postsList(
    _: unknown,
    args: {
      page?: number
      pageSize?: number
      keyword?: string | null
      sortBy?: string | null
      sortOrder?: string | null
    },
    context: GraphQLContext
  ) {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      sortBy = 'date',
      sortOrder = 'desc',
    } = args
    const pageNum = Math.max(1, page)
    const size = Math.min(100, Math.max(1, pageSize))
    const keywordTrimmed = keyword?.trim()

    const where: Prisma.PostWhereInput = {
      published: true,
      locale: {
        code: context.locale,
      },
      ...(keywordTrimmed
        ? {
            title: {
              contains: keywordTrimmed,
              mode: 'insensitive',
            },
          }
        : {}),
    }
    const orderBy =
      sortBy === 'updatedAt'
        ? { updatedAt: sortOrder as 'asc' | 'desc' }
        : { date: sortOrder as 'asc' | 'desc' }

    const [rowsPage, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { tags: true },
        orderBy,
        skip: (pageNum - 1) * size,
        take: size,
      }),
      prisma.post.count({ where }),
    ])
    const totalPages = Math.ceil(total / size) || 1
    return {
      list: rowsPage.map(mapRowToPost),
      metaData: {
        pagination: {
          total,
          page: pageNum,
          pageSize: size,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    }
  },
}
