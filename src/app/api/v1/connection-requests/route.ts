import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const connection_requests_recieved = await prisma.$queryRaw`
    SELECT c.id, c.created_at, c.updated_at, c.status, u.email, 
    u.fullname, u.id, u.batch, u.faculty, u.img_url
    FROM connection_requests c
    JOIN users u ON c.from = u.id
    WHERE c.to = ${+userId}
    `;
  const connection_requests_sent = await prisma.$queryRaw`
    SELECT c.id, c.created_at, c.updated_at, c.status, u.email, 
    u.fullname, u.id, u.batch, u.faculty, u.img_url
    FROM connection_requests c
    JOIN users u ON c.to = u.id
    WHERE c.from = ${+userId}
    `;
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      connection_requests_recieved,
      connection_requests_sent,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
