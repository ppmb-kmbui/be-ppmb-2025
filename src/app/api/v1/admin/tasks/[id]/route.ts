import { prisma } from "@/lib/prisma";
import serverResponse from "@/utils/serverResponse";
import { NextRequest } from "next/server";
export const maxDuration = 60;
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

  const networkingKating = await prisma.networkingKatingTask.findMany({
    where: {
      fromId: userId,
    },
    orderBy: {
      to: {
        batch: "desc",
      }
    },
  });

  await prisma.$disconnect();

  return serverResponse({
    success: true,
    message: `Berhasil mengambil data user ${userId}`,
    data: {
      networkingTask,
      firstFossibTask,
      secondFossibTask,
      insightHuntingTask,
      explorerTask,
      mentoringReflectionTask,
      mentoringVlogTask,
      networkingKating,
    }
  })
}
