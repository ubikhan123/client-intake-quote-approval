import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString || connectionString.includes("user:password")) {
        // Return a dummy client that won't crash on import — queries will fail at runtime
        // when no real DATABASE_URL is configured
        const adapter = new PrismaPg({ connectionString: "postgresql://localhost/dummy" });
        return new PrismaClient({ adapter } as any);
    }

    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
