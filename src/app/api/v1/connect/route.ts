import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const connections = await prisma.connection.findMany({
    where: {
      fromId: +userId,
    },
    include: {
      to: {
        omit: {
          password: false,
        },
      },
      from: {
        omit: {
          password: false,
        },
      },
    },
  });
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      connections,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
