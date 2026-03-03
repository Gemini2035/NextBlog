import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

config({ path: '.env.local' })
config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.Preview_DATABASE_URL ?? process.env.Production_DATABASE_URL ?? ''
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
