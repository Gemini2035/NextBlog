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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace('posts/', ''),
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
  disableImportAliasWarning: true,
})
