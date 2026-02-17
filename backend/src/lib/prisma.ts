import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";

const globalPrisma = globalThis as unknown as {
    prisma: PrismaClient|undefined
}
const connectingString = `${process.env.DATABASE_URL}`;
const prisma = globalPrisma.prisma?? new PrismaClient({
    log:['query'], 
    accelerateUrl: connectingString
});
if (process.env.NODE_ENV !== "production") {
  globalPrisma.prisma = prisma;
}

export { prisma}