import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect();

  const secondFossibSessionSubmission = await prisma.secondFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  await prisma.$disconnect();

  return serverResponse({
    success: true,
    message: "Berhasil mendapatkan data submisi Fossib kedua",
    data: secondFossibSessionSubmission
  });
}

interface SecondFossibSessionSubmissionDto {
  file_url: string;
  description: string;
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }

  let body;
  try {
    body = (await req.json()) as SecondFossibSessionSubmissionDto;
  } catch (error) {
    return serverResponse({
      success: false,
      message: "Operasi gagal",
      error: "Body tidak valid atau kosong",
      status: 400
    });
  }

  if (!body.file_url || !body.description) {
    return serverResponse({success: false, message: "Operasi gagal", error: "Body tidak lengkap", status: 400})
  }

  await prisma.$connect();

  const check = await prisma.secondFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  if (check) {
    const sub = await prisma.secondFossibSessionSubmission.update({
      where: {
        id: check.id,
      },
      data: body,
    });

    await prisma.$disconnect();

    return serverResponse({
      success: true,
      message: "Berhasil mengupdate submisi Fossib kedua",
      data: sub,
      status: 200
    });
  }

  const secondFossibSessionSubmission = await prisma.secondFossibSessionSubmission.create({
    data: {
      userId: +userId,
      ...body,
    },
  });

  await prisma.$disconnect();

  return serverResponse({
    success: true,
    message: "Berhasil membuat submisi Fossib kedua",
    data: secondFossibSessionSubmission,
    status: 200
  });
}