import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!params.id) {
    return new Response("Bad Request", { status: 400 });
  }
  const userId = +params.id;
  await prisma.$connect();

  const networkingTask = await prisma.networkingTask.findMany({
    where: {
      fromId: userId,
    },
    include: {
      from: true,
      to: true,
      questions: {
        include: {
          question: true,
          task: {
            select: {
              score: true,
            },
          },
        },
      },
    },
  });

  const firstFossibTask = await prisma.firstFossibSessionSubmission.findFirst({
    where: {
      userId: userId,
    },
    include: {
      FirstFossibSessionScore: {
        select: {
          score: true,
        },
      },
    },
  });

  const secondFossibTask = await prisma.secondFossibSessionSubmission.findFirst(
    {
      where: {
        userId: userId,
      },
      include: {
        SecondFossibSessionScore: {
          select: {
            score: true,
          },
        },
      },
    }
  );

  const insightHuntingTask = await prisma.insightHuntingSubmission.findMany({
    where: {
      userId: userId,
    },
    include: {
      InsightHuntingSubmissionScore: {
        select: {
          score: true,
        },
      },
    },
  });

  const explorerTask = await prisma.explorerSubmission.findMany({
    where: {
      userId: userId,
    },
    include: {
      ExplorerSubmissionScore: {
        select: {
          score: true,
        },
      },
    },
  });

  const mentoringReflectionTask = await prisma.mentoringReflection.findFirst({
    where: {
      userId: userId,
    },
    include: {
      MentoringReflectionScore: {
        select: {
          score: true,
        },
      },
    },
  });

  const mentoringVlogTask = await prisma.mentoringVlogSubmission.findFirst({
    where: {
      userId: userId,
    },
    include: {
      MentoringVlogSubmissionScore: {
        select: {
          score: true,
        },
      },
    },
  });

  const networkingKating = await prisma.connectSubmission.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      batch: "desc",
    },
  });

  await prisma.$disconnect();

  return new Response(
    JSON.stringify({
      networkingTask,
      firstFossibTask,
      secondFossibTask,
      insightHuntingTask,
      explorerTask,
      mentoringReflectionTask,
      mentoringVlogTask,
      networkingKating,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
