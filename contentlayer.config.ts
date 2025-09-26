import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

// 类型定义
interface TagStat {
  name: string
  count: number
}

interface TagListData {
  tagStats: string[]
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the post',
      required: false,
    },
    published: {
      type: 'boolean',
      description: 'Whether the post is published',
      required: false,
      default: true,
    },
    featured: {
      type: 'boolean',
      description: 'Whether the post is featured (pinned)',
      required: false,
      default: false,
    },
    updatedAt: {
      type: 'date',
      description: 'The last update date of the post',
      required: false,
    },
    locale: {
      type: 'string',
      description: 'The locale of the post',
      required: false,
      default: 'zh',
    },
    originalSlug: {
      type: 'string',
      description: 'The original slug for cross-language linking',
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => {
        const pathParts = post._raw.flattenedPath.split('/')
        return pathParts[pathParts.length - 1].replace('.mdx', '')
      },
    },
    locale: {
      type: 'string',
      resolve: (post) => {
        const pathParts = post._raw.flattenedPath.split('/')
        return pathParts[0] || 'zh'
      },
    },
    url: {
      type: 'string',
      resolve: (post) => {
        const pathParts = post._raw.flattenedPath.split('/')
        const slug = pathParts[pathParts.length - 1].replace('.mdx', '')
        return `/posts/${slug}`
      },
    },
  },
}))

// 全局标签列表文档类型
export const TagList = defineDocumentType(() => ({
  name: 'TagList',
  filePathPattern: 'taglist.json',
  contentType: 'data',
  fields: {
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'All unique tags from all posts',
      required: true,
    },
    tagStats: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tag usage statistics as JSON string',
      required: true,
    },
    totalTags: {
      type: 'number',
      description: 'Total number of unique tags',
      required: true,
    },
    totalPosts: {
      type: 'number',
      description: 'Total number of posts',
      required: true,
    },
    generatedAt: {
      type: 'string',
      description: 'Generation timestamp',
      required: true,
    },
  },
  computedFields: {
    // 按使用次数排序的标签
    sortedByUsage: {
      type: 'list',
      of: { type: 'string' },
      resolve: (tagList: TagListData) => {
        const stats: TagStat[] = JSON.parse(tagList.tagStats.join(''))
        return stats
          .sort((a: TagStat, b: TagStat) => b.count - a.count)
          .map((stat: TagStat) => stat.name)
      },
    },
    // 最常用的标签
    mostUsed: {
      type: 'list',
      of: { type: 'string' },
      resolve: (tagList: TagListData) => {
        const stats: TagStat[] = JSON.parse(tagList.tagStats.join(''))
        return stats
          .sort((a: TagStat, b: TagStat) => b.count - a.count)
          .slice(0, 10)
          .map((stat: TagStat) => stat.name)
      },
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post, TagList],
  disableImportAliasWarning: true,
})
