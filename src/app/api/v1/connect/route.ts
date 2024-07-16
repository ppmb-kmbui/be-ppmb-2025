import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const connections = await prisma.$queryRaw`
    SELECT c.id, c.created_at, c.updated_at, c.status, u.email, 
    u.fullname, u.id, u.faculty, u.img_url
    FROM connections c
    JOIN users u ON c.to = u.id
    WHERE c.from = ${+userId}
    `;
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      connections,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
