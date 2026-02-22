import { config } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })
config({ path: '.env' })
const connectionString = process.env.Production_DATABASE_URL ?? ''

const adapter = new PrismaPg({ connectionString })
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export { prisma }