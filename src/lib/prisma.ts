import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma || new PrismaClient({
  log: ["query"],
});

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
