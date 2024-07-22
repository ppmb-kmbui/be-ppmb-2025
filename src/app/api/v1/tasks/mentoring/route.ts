import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.$connect();
  const first = await prisma.firstMentoringReflection.findFirst({
    where: { userId: +userId },
  });
  const second = await prisma.secondMentoringReflection.findFirst({
    where: { userId: +userId },
  });
  const third = await prisma.thirdMentoringReflection.findFirst({
    where: { userId: +userId },
  });
  const fourth = await prisma.fourthMentoringReflection.findFirst({
    where: { userId: +userId },
  });
  const vlog = await prisma.mentoringVlogSubmission.findFirst({
    where: { userId: +userId },
  });
  await prisma.$disconnect();

  return new Response(JSON.stringify({ first, second, third, fourth, vlog }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
