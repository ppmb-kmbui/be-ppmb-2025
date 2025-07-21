import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  if (!userId || !params.id) {
    return InvalidHeadersResponse;
  }

  let body = await req.json();
  await prisma.$connect();
  if (params.id === "vlog") {
    try {
      body = body as {file_url: string};
    } catch {
      return serverResponse({
        success: false,
        message: "Operasi gagal",
        error: "Body tidak valid atau kosong",
        status: 400
      });
    }
    const exist = await prisma.mentoringVlogSubmission.findFirst({
      where: { userId: +userId },
    });
    if (exist) {
      const mentoringVlogSubmission = await prisma.mentoringVlogSubmission.updateMany({
        where: { id: exist.id },
        data: {
          ...body,
        },
      });
      await prisma.$disconnect();
      return serverResponse({success: true, message: "Berhasil submit vlog kamu", data: mentoringVlogSubmission, status: 200});
    }
    const mentoringVlogSubmission = await prisma.mentoringVlogSubmission.create({
      data: {
        ...body,
        userId: +userId,
      },
    });
    await prisma.$disconnect();
    return serverResponse({
      success: true,
      message: "Berhasil submit refleksi kamu",
      data: mentoringVlogSubmission,
      status: 200
    });
  }

  if (params.id === "reflection") {
    try {
      body = body as {file_url: string, description: string};
    } catch {
      return serverResponse({
        success: false,
        message: "Operasi gagal",
        error: "Body tidak valid atau kosong",
        status: 400
      });
    }

    const exist = await prisma.mentoringReflection.findFirst({
      where: { userId: +userId },
    });

    if (exist) {
      const mentoringReflectionSubmission = await prisma.mentoringReflection.update({
        where: { id: exist.id },
        data: {
          ...body,
        },
      });
      await prisma.$disconnect();

      return serverResponse({
        success: true,
        message: "Berhasil submit refleksi kamu",
        data: mentoringReflectionSubmission,
        status: 200
      });
    }

    const mentoringReflectionSubmission = await prisma.mentoringReflection.create({
      data: {
        ...body,
        userId: +userId,
      },
    });
    await prisma.$disconnect();
    return serverResponse({
      success: true,
      message: "Berhasil submit refleksi kamu",
      data: mentoringReflectionSubmission,
      status: 200
    });
  }

  return new Response("Page does not exists.", { status: 404 });
}
