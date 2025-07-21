import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const maxDuration = 60;

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await req.json();
  await prisma.$connect();

  const check = await prisma.networkingScore.findFirst({
    where: {
      userId: +params.id,
    },
  });

  if (check) {
    const score = await prisma.networkingScore.update({
      where: {
        id: check.id,
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

  const score = await prisma.networkingScore.create({
    data: {
      score: data.score,
      userId: +params.id,
    },
  });

  await prisma.$disconnect();

  return new Response(JSON.stringify(score), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
