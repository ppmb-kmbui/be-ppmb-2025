import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.$connect();

  const sub = await prisma.secondFossibSessionSubmission.findMany({
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

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  if (!body) {
    return new Response("Bad Request", { status: 400 });
  }

  await prisma.$connect();

  const check = await prisma.secondFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  if (check) {
    const sub = await prisma.secondFossibSessionSubmission.update({
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

  const sub = await prisma.secondFossibSessionSubmission.create({
    data: {
      userId: +userId,
      ...body,
    },
  });

  await prisma.$disconnect();

  return new Response(JSON.stringify(sub), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
