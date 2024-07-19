import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const targetId = params.id;
  if (!targetId) {
    return new Response("Bad Request", { status: 400 });
  }

  await prisma.$connect();
  const targetUser = await prisma.user.findUnique({
    where: { id: +targetId },
  });
  if (!targetUser) {
    await prisma.$disconnect();
    return new Response("Target user not found", { status: 404 });
  }
  const sent = await prisma.connectionRequest.findFirst({
    where: {
      fromId: +userId,
      toId: +targetId,
    },
  });
  if (sent) {
    await prisma.$disconnect();
    return new Response("Connection request already sent", { status: 400 });
  }
  const connectionRequest = await prisma.connectionRequest.create({
    data: {
      fromId: +userId,
      toId: +targetId,
      status: "pending",
    },
  });
  await prisma.$disconnect();

  return new Response(
    JSON.stringify({
      ...connectionRequest,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const targetId = params.id;
  if (!targetId) {
    return new Response("Bad Request", { status: 400 });
  }
  await prisma.$connect();
  const targetUser = await prisma.user.findUnique({
    where: { id: +targetId },
  });
  if (!targetUser) {
    await prisma.$disconnect();
    return new Response("Target user not found", { status: 404 });
  }
  const transaction = await prisma.$transaction([
    prisma.connection.create({
      data: {
        fromId: +userId,
        toId: +targetId,
        status: "accepted",
      },
    }),
    prisma.connection.create({
      data: {
        fromId: +targetId,
        toId: +userId,
        status: "accepted",
      },
    }),
    prisma.connectionRequest.updateMany({
      where: {
        OR: [
          {
            fromId: +userId,
            toId: +targetId,
          },
          {
            fromId: +targetId,
            toId: +userId,
          },
        ],
      },
      data: {
        status: "accepted",
      },
    }),
  ]);
  const [connection1, connection2, _] = transaction;
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      connection_1: connection1,
      connection_2: connection2,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const targetId = params.id;
  if (!targetId) {
    return new Response("Bad Request", { status: 400 });
  }
  await prisma.$connect();
  const targetUser = await prisma.user.findUnique({
    where: { id: +targetId },
  });
  if (!targetUser) {
    await prisma.$disconnect();
    return new Response("Target user not found", { status: 404 });
  }
  const connr = await prisma.connectionRequest.deleteMany({
    where: {
      fromId: +targetId,
      toId: +userId,
      status: {
        not: {
          equals: "accepted",
        },
      },
    },
  });

  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      deleted: connr,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
