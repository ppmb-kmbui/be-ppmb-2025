import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const subs = await prisma.connectSubmission.findMany({
    where: {
      userId: +userId,
    },
    orderBy: {
      batch: "desc",
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(subs), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  await prisma.$connect();
  const sub = await prisma.connectSubmission.create({
    data: {
      ...body,
      userId: +userId,
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(sub), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
