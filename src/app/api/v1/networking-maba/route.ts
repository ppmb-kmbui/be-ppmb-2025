import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  const conns = await prisma.networkingTask.findMany({
    where: {
      fromId: +userId,
    },
    include: {
      to: {
        omit: {
          password: false,
        },
      },
      from: {
        omit: {
          password: false,
        },
      },
      questions: {
        include: {
          question: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  return serverResponse({
    success: true,
    message: "Berhasil mengambil data networking maba",
    data: conns,
    status: 200,
  });
}