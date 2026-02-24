import { prisma } from '@/server/prisma'

export const postResolvers = {
  async post(_: unknown, { id }: { id: string }) {
    const row = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!row) return null
    return {
      ...row,
      date: row.date.toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      tags: row.tags.map((t) => t.name),
      content: row.content ? JSON.stringify(row.content) : null,
    }
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
    return rows.map((row) => ({
      ...row,
      date: row.date.toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      tags: row.tags.map((t) => t.name),
      content: row.content ? JSON.stringify(row.content) : null,
    }))
  },
}
