import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();

  const exp = await prisma.explorerSubmission.findMany({
    where: {
      userId: +userId,
    },
  });

  await prisma.$disconnect();

  return new Response(JSON.stringify(exp), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  await prisma.$connect();
  const exp = await prisma.explorerSubmission.create({
    data: {
      ...body,
      userId: +userId,
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(exp), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
