import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
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
  return new Response(JSON.stringify(conns), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
