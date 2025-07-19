import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

interface insightHuntingSubmissionDto {
  file_url: string
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }

  let body;
  try {
    body = (await req.json()) as insightHuntingSubmissionDto;
  } catch (error) {
    return serverResponse({
      success: false,
      message: "Operasi gagal",
      error: "Body tidak valid atau kosong",
      status: 400
    });
  }
  await prisma.$connect();

  const check = await prisma.insightHuntingSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  if (check) {
    const insightHuntingSubmission = await prisma.insightHuntingSubmission.update({
      where: {
        id: check.id,
      },
      data: body,
    });
    await prisma.$disconnect();
    return serverResponse({success: true, message: "Berhasil memperoleh data Insight Hunting kamu", data: insightHuntingSubmission, status: 200});
  }

  const insightHuntingSubmission = await prisma.insightHuntingSubmission.create({
    data: {
      userId: +userId,
      ...body,
    },
  });
  await prisma.$disconnect();
  return serverResponse({success: true, message: "Berhasil memperoleh data Insight Hunting kamu", data: insightHuntingSubmission, status: 200});

}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  const sub = await prisma.insightHuntingSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });
  await prisma.$disconnect();
  return serverResponse({
    success: true,
    message: "Berhasil memperoleh data Insight Hunting kamu",
    data: sub,
    status: 200,
  });
}
