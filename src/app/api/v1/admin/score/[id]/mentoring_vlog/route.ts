import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await req.json();
  await prisma.$connect();

  const check = await prisma.mentoringVlogSubmissionScore.findFirst({
    where: {
      submissionId: +params.id,
    },
  });

  if (check) {
    const score = await prisma.mentoringVlogSubmissionScore.update({
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

  const score = await prisma.mentoringVlogSubmissionScore.create({
    data: {
      score: data.score,
      submissionId: +params.id,
    },
  });

  await prisma.$disconnect();

  return new Response(JSON.stringify(score), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
