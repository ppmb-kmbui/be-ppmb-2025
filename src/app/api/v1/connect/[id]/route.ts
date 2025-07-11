import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse, InvalidTargetUserResponse, InvalidUserResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  const targetId = params.id;

  if (!userId || !targetId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect;
  const user = await prisma.user.findUnique({
    where: { id: +userId }
  });

  if (!user) {
    await prisma.$disconnect();
    return InvalidUserResponse;
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: +targetId },
  });

  if (!targetUser) {
    await prisma.$disconnect();
    return InvalidTargetUserResponse;
  }

  const sent = await prisma.connectionRequest.findFirst({
    where: {
      fromId: +userId,
      toId: +targetId,
    },
  });

  if (sent) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Invalid Connection Attempt", error: "Connextion request sudah dibuat", status: 409});
  }

  const recieved = await prisma.connectionRequest.findFirst({
    where: {
      fromId: +targetId,
      toId: +userId,
    },
  });
  if (recieved) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Invalid Connection Attempt", error: "User sudah mengirim connextion request kepada Anda", status: 409});
  }
  
  const connectionRequest = await prisma.connectionRequest.create({
    data: {
      fromId: +userId,
      toId: +targetId,
      status: "pending",
    },
  });
  await prisma.$disconnect();

  return serverResponse({
    success: true,
    message: "Connection Request berhasil dibuat",
    data: connectionRequest,
    status: 200
  });
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  const targetId = params.id;

  if (!userId || !targetId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect;
  const user = await prisma.user.findUnique({
    where: { id: +userId }
  });

  if (!user) {
    await prisma.$disconnect();
    return InvalidUserResponse;
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: +targetId },
  });

  if (!targetUser) {
    await prisma.$disconnect();
    return InvalidTargetUserResponse;
  }

  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      fromId: +targetId,
      toId: +userId,
    },
  })

  if (!connectionRequest) {
    return serverResponse({success: false, message: "Invalid Connection", error: "Connection Request tidak ditemukan", status: 403})
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
  return serverResponse({success: true, message: "Connection succesful created", data: {connection1, connection2}, status: 200});
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  const targetId = params.id;

  if (!userId || !targetId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect;
  const user = await prisma.user.findUnique({
    where: { id: +userId }
  });

  if (!user) {
    await prisma.$disconnect();
    return InvalidUserResponse;
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: +targetId },
  });

  if (!targetUser) {
    await prisma.$disconnect();
    return InvalidTargetUserResponse;
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
  return serverResponse({success: true, message: `Deleted Connection Request to ${targetUser.fullname}`, data: connr, status: 200});
}