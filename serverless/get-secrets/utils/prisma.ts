import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = globalPrisma.prisma ?? new PrismaClient({
    log: ['query'],
    adapter,
});
if (process.env.NODE_ENV !== "production") {
  globalPrisma.prisma = prisma;
}

export { prisma}