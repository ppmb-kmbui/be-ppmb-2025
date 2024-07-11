import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const user = await prisma.user.findUnique({
    where: {
      id: +userId,
    },
  });
  await prisma.$disconnect();
  const { password, ...profile } = user!;
  return new Response(JSON.stringify(profile), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
