import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  const firstFossibSessionSubmission = await prisma.firstFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  await prisma.$disconnect();
  return serverResponse({success: true, message: "Berhasil mendapatkan data submisi Fossib pertama", data: firstFossibSessionSubmission})
}

interface firstFossibSessionSubmissionDto {
  file_url: string,
  description: string
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }

  let body;
  try {
    body = (await req.json()) as firstFossibSessionSubmissionDto;
  } catch (error) {
    return serverResponse({
      success: false,
      message: "Operasi gagal",
      error: "Body tidak lengkap. Template yang dibutuhkan: { file_url: string, description: string }",
      status: 400
    })
  }

  if (!body.file_url || !body.description) {
    return serverResponse({success: false, message: "Operasi gagal", error: "Body tidak lengkap", status: 400})
  }
  
  await prisma.$connect();
  const check = await prisma.firstFossibSessionSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  if (check) {
    const firstFossibSessionSubmission = await prisma.firstFossibSessionSubmission.update({
      where: {
        id: check.id,
      },
      data: body
    });

    await prisma.$disconnect();

    return serverResponse({ success: true, message: "Berhasil mengupdate submisi Fossib pertama", data: firstFossibSessionSubmission, status: 200 });
  }

  const firstFossibSessionSubmission = await prisma.firstFossibSessionSubmission.create({
    data: {
      userId: +userId,
      ...body,
    },
  });
  await prisma.$disconnect();
  return serverResponse({ success: true, message: "Berhasil membuat submisi Fossib pertama", data: firstFossibSessionSubmission, status: 200 });
}
