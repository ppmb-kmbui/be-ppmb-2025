import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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
    include: {
      _count: {
        select: {
          ConnectionReciever: true,
        },
      },
      NetworkingTaskSender: {
        where: {
          fromId: +userId,
        },
        include: {
          questions: {
            include: {
              question: true,
            },
          },
          to: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
    omit: {
      password: true,
    },
  });
  await prisma.$disconnect();
  const { NetworkingTaskSender, _count, ...rest } = user!;

  return new Response(
    JSON.stringify({
      ...rest,
      followers: _count.ConnectionReciever,
      networking_tasks: NetworkingTaskSender,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function PUT(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  if (!body.imgUrl) {
    return new Response("imgUrl is required", { status: 400 });
  }
  await prisma.$connect();
  const user = await prisma.user.update({
    where: {
      id: +userId,
    },
    data: {
      imgUrl: body.imgUrl,
    },
    omit: {
      password: true,
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
