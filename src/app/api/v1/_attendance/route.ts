import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const availableAttendances = await prisma.$queryRaw`
  SELECT * FROM attendances
  WHERE created_at + (expires_in || ' seconds')::INTERVAL >= NOW() 
  `;
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      absensi: availableAttendances,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
