import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

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
    url: {
      type: 'string',
      resolve: (post) => {
        const locale = post.locale || 'zh'
        return `/${locale}/posts/${post.slug}`
      },
    },
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
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
  disableImportAliasWarning: true,
})
