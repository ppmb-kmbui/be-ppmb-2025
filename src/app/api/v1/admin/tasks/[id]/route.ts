import { prisma } from "@/lib/prisma";
import { CLUSTERS } from "@/lib/const";
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
  
  const networkingAngkatan = await prisma.networkingTask.findMany({
    where: {
      is_done: true,
      fromId: +userId,
    },
    select: {
      to: {
        select: {
          faculty: true,
        },
      },
    },
  });

  const progressMap = {
    SAINTEK: { progress: 0, min: 3 },
    SOSHUM: { progress: 0, min: 3 },
    RIK_VOK: { progress: 0, min: 3 },
    OTHER: { progress: 0, min: 3 },
  };

  for (const angkatan of networkingAngkatan) {
    const faculty = angkatan.to.faculty;

    if (CLUSTERS["SAINTEK"].includes(faculty!.toUpperCase())) {
      progressMap.SAINTEK = {
        progress: progressMap.SAINTEK.progress + 1,
        min: 3,
      };
    }

    if (CLUSTERS["SOSHUM"].includes(faculty!.toUpperCase())) {
      progressMap.SOSHUM = {
        progress: progressMap.SOSHUM.progress + 1,
        min: 3,
      };
    }

    if (CLUSTERS["RIK_VOK"].includes(faculty!.toUpperCase())) {
      progressMap.RIK_VOK = {
        progress: progressMap.RIK_VOK.progress + 1,
        min: 3,
      };
    }

  }

  const networkingKating = await prisma.networkingKatingTask.findMany({
    where: {
      fromId: +userId,
    },
    select: {
      to: {
        select: {
          batch: true,
        },
      },
    },
  });

  const progressKatingMap = {
    "2024": { progres: 0, min: 6 },
    "2023": { progres: 0, min: 3 },
    "2022": { progres: 0, min: 1 },
  };
  for (const kating of networkingKating) {
    if (kating.to.batch === 2024) {
      progressKatingMap["2024"].progres++;
    }
    if (kating.to.batch === 2023) {
      progressKatingMap["2023"].progres++;
    }
    if (kating.to.batch === 2022) {
      progressKatingMap["2022"].progres++;
    }
  }

  const fossib1 = await prisma.firstFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  const fossib2 = await prisma.secondFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  const insightHunting = await prisma.insightHuntingSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  const mentoringReflection = await prisma.mentoringReflection.findFirst({
    where: {
      userId: +userId,
    },
  });

  const mentoringVlog = await prisma.mentoringVlogSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  const exp = await prisma.explorerSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  await prisma.$disconnect();

  return serverResponse({
    success: true,
    message: "Berhasil mendapatkan tasks user",
    data: {
      networkingAngkatan: { progress: progressMap, min: 20 },
      networkingKating: { progress: progressKatingMap, min: 10 },
      kmbuiExplorerDone: !!exp,
      firstFossibDone: !!fossib1,
      secondFossibDone: !!fossib2,
      insightHuntingDone: !!insightHunting,
      mentoringReflectionDone: !!mentoringReflection,
      mentoringVlogDone: !!mentoringVlog,
    }
  });
}
