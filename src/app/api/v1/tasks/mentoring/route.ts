import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const reflection = await prisma.mentoringReflection.findFirst({
    where: { userId: +userId },
  });
  const vlog = await prisma.mentoringVlogSubmission.findFirst({
    where: { userId: +userId },
  });
  await prisma.$disconnect();

  return new Response(JSON.stringify({ reflection, vlog }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
