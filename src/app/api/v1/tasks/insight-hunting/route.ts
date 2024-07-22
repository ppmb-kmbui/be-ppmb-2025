import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  await prisma.$connect();
  const check = await prisma.insightHuntingSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });
  if (check) {
    const sub = await prisma.insightHuntingSubmission.update({
      where: {
        id: check.id,
      },
      data: body,
    });
    await prisma.$disconnect();
    return new Response(JSON.stringify(sub), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const res = await prisma.insightHuntingSubmission.create({
    data: {
      userId: +userId,
      ...body,
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const sub = await prisma.insightHuntingSubmission.findMany({
    where: {
      userId: +userId,
    },
  });
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      data: sub[0],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
