import { CLUSTERS } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");

  if (!userId) {
    return InvalidHeadersResponse;
  }

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
    "2024": { progress: 0, min: 4 },
    "2023": { progress: 0, min: 3 },
    "2022": { progress: 0, min: 3 },
  };

  for (const kating of networkingKating) {
    if (kating.to.batch === 2024) {
      progressKatingMap["2024"].progress++;
    }
    if (kating.to.batch === 2023) {
      progressKatingMap["2023"].progress++;
    }
    if (kating.to.batch === 2022) {
      progressKatingMap["2022"].progress++;
    }
  }

  const fossib1 = await prisma.firstFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  const insightHunting = await prisma.insightHuntingSubmission.findFirst({
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
      networkingAngkatan: { progress: progressMap, min: 10 },
      networkingKating: { progress: progressKatingMap, min: 10 },
      kmbuiExplorerDone: !!exp,
      firstFossibDone: !!fossib1,
      insightHuntingDone: !!insightHunting,
      mentoringVlogDone: !!mentoringVlog,
    },
  });
}
