import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await req.json();
  await prisma.$connect();

  const check = await prisma.networkingTaskScore.findFirst({
    where: {
      fromId: data.from_id,
      toId: data.to_id,
    },
  });

  if (check) {
    const score = await prisma.networkingTaskScore.update({
      where: {
        fromId_toId: {
          fromId: data.from_id,
          toId: data.to_id,
        },
      },
      data: {
        score: data.score,
      },
    });
    await prisma.$disconnect();
    return new Response(JSON.stringify(score), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const score = await prisma.networkingTaskScore.create({
    data: {
      score: data.score,
      fromId: data.from_id,
      toId: data.to_id,
    },
  });

  await prisma.$disconnect();

  return new Response(JSON.stringify(score), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
