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
  if (!params.id) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = await req.json();
  await prisma.$connect();
  const exist = await prisma.mentoringVlogSubmission.findFirst({
    where: { userId: +userId },
  });
  if (exist) {
    const sub = await prisma.mentoringVlogSubmission.updateMany({
      where: { userId: +userId },
      data: {
        ...body,
      },
    });
    await prisma.$disconnect();
    return new Response(JSON.stringify(sub), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const sub = await prisma.mentoringVlogSubmission.create({
    data: {
      ...body,
      userId: +userId,
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(sub), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
