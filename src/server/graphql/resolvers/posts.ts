import { Prisma } from '@prisma/client'
import { prisma } from '@/server/prisma'

function mapRowToPost(row: {
  id: string
  locale: string
  title: string
  description: string | null
  date: Date
  updatedAt: Date | null
  published: boolean
  featured: boolean
  tags: { name: string }[]
  content: unknown
  createdAt: Date
}) {
  return {
    ...row,
    date: row.date.toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    tags: row.tags.map((t) => t.name),
    content: row.content ? JSON.stringify(row.content) : null,
  }
}

/** 全文检索：按 ts_rank 相关度排序，并支持标签匹配；返回分页后的 id 列表与 total */
async function fullTextSearchIds(
  locale: string,
  keyword: string,
  sortBy: string,
  sortOrder: string,
  limit: number,
  offset: number
): Promise<{ ids: string[]; total: number }> {
  const orderCol = sortBy === 'updatedAt' ? 'p."updatedAt"' : 'p.date'
  const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC'
  const query = Prisma.sql`
    WITH matches AS (
      SELECT p.id, ts_rank(p.search_vector, plainto_tsquery('simple', ${keyword})) AS rank
      FROM posts p
      WHERE p.published = true AND p.locale = ${locale}
        AND p.search_vector @@ plainto_tsquery('simple', ${keyword})
      UNION
      SELECT p.id, ts_rank(to_tsvector('simple', pt.name), plainto_tsquery('simple', ${keyword})) AS rank
      FROM posts p
      JOIN post_tags pt ON pt."postId" = p.id
      WHERE p.published = true AND p.locale = ${locale}
        AND to_tsvector('simple', pt.name) @@ plainto_tsquery('simple', ${keyword})
    ),
    ranked AS (
      SELECT id, max(rank) AS rank FROM matches GROUP BY id
    ),
    total AS (SELECT count(*)::int AS c FROM ranked),
    page AS (
      SELECT r.id, (SELECT c FROM total) AS total
      FROM ranked r
      JOIN posts p ON p.id = r.id
      ORDER BY r.rank DESC, ${Prisma.raw(orderCol)} ${Prisma.raw(orderDir)}
      LIMIT ${limit} OFFSET ${offset}
    )
    SELECT id, (SELECT c FROM total) AS total FROM page
  `
  const rows = await prisma.$queryRaw<Array<{ id: string; total: number }>>(query)
  const total = rows[0]?.total ?? 0
  const ids = rows.map((r) => r.id)
  return { ids, total }
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
    { id, locale, limit }: { id: string; locale: string; limit: number }
  ) {
    const rows = await prisma.post.findMany({
      where: { published: true, locale, id: { not: id } },
      take: limit,
      include: { tags: true },
    })
    return rows.map(mapRowToPost)
  },
  async featuredPosts(_: unknown, { locale }: { locale: string }) {
    const rows = await prisma.post.findMany({
      where: { published: true, featured: true, locale },
      include: { tags: true },
    })
    return rows.map(mapRowToPost)
  },
  async recentPosts(
    _: unknown,
    { locale, limit = 10 }: { locale: string; limit?: number }
  ) {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const rows = await prisma.post.findMany({
      where: {
        published: true,
        locale,
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
      locale: string
      page?: number
      pageSize?: number
      keyword?: string | null
      sortBy?: string | null
      sortOrder?: string | null
    }
  ) {
    const {
      locale,
      page = 1,
      pageSize = 10,
      keyword,
      sortBy = 'date',
      sortOrder = 'desc',
    } = args
    const pageNum = Math.max(1, page)
    const size = Math.min(100, Math.max(1, pageSize))
    const keywordTrimmed = keyword?.trim()

    if (keywordTrimmed) {
      const { ids, total } = await fullTextSearchIds(
        locale,
        keywordTrimmed,
        sortBy ?? 'date',
        sortOrder ?? 'desc',
        size,
        (pageNum - 1) * size
      )
      if (ids.length === 0) {
        const totalPages = Math.ceil(total / size) || 1
        return {
          list: [],
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
      }
      const rowsPage = await prisma.post.findMany({
        where: { id: { in: ids } },
        include: { tags: true },
      })
      const byId = new Map(rowsPage.map((r) => [r.id, r]))
      const ordered = ids.map((id) => byId.get(id)!).filter(Boolean)
      const totalPages = Math.ceil(total / size) || 1
      return {
        list: ordered.map(mapRowToPost),
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
    }

    const where: Prisma.PostWhereInput = {
      published: true,
      locale,
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
