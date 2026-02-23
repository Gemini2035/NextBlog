import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.Production_DATABASE_URL
if (!connectionString) {
  throw new Error('Production_DATABASE_URL 未设置，请在 .env 或 .env.local 中配置')
}
const adapter = new PrismaPg({ connectionString })

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }