export const typeDefs = /* GraphQL */ `
  type Post {
    id: ID!
    locale: String!
    title: String!
    description: String
    date: String!
    updatedAt: String
    published: Boolean!
    featured: Boolean!
    tags: [String!]!
    content: String
    createdAt: String!
  }

  type Query {
    post(id: ID!): Post
    relatedPosts(id: ID!, locale: String!, limit: Int!): [Post!]!
  }
`
