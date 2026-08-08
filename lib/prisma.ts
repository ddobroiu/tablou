import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
    if (connectionString && (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://'))) {
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter, log: ['query'] });
    } else {
        // Fallback for Build-time initialization to prevent Prisma 7 constructor validation error
        // In Prisma 7, using engine type "client" requires either "adapter" or "accelerateUrl"
        const dummyUrl = "postgresql://postgres:postgres@localhost:5432/postgres";
        const pool = new Pool({ connectionString: dummyUrl });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter, log: ['error'] });
    }
} else {
    prisma = globalForPrisma.prisma;
}

export { prisma };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
