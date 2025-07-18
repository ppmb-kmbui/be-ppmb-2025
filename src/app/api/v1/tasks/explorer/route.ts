import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect();
  const explorerSubmission = await prisma.explorerSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  await prisma.$disconnect();

  return serverResponse({success: true, message: "Berhasil memperoleh submission anda", data: explorerSubmission, status: 200});
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");

  if (!userId) {
    return InvalidHeadersResponse;
  }

  const body = await req.json();
  await prisma.$connect();
  
  const exists = await prisma.explorerSubmission.findFirst({
    where: {
      userId: +userId,
    },
  });

  if (exists) {
    const explorerSubmission = await prisma.explorerSubmission.update({
      where: { id: exists.id },
      data: {
        ...body,
      },
    });

    await prisma.$disconnect();
    return serverResponse({success: true, message: "Berhasil memperoleh submission anda", data: explorerSubmission, status: 200});
  }

  const explorerSubmission = await prisma.explorerSubmission.create({
    data: {
      ...body,
      userId: +userId,
    },
  });
  
  await prisma.$disconnect();
  return serverResponse({success: true, message: "Berhasil memperoleh submission anda", data: explorerSubmission, status: 200});
}
