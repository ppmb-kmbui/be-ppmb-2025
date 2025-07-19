import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  const reflection = await prisma.mentoringReflection.findFirst({
    where: { userId: +userId },
  });
  const vlog = await prisma.mentoringVlogSubmission.findFirst({
    where: { userId: +userId },
  });
  await prisma.$disconnect();

  // Use serverResponse to format the response
  return serverResponse({success: true, message: "Berhasil mengambil data kamu", data: { reflection, vlog, status: 200}});
}
