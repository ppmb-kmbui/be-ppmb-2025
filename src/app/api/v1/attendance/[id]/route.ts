import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const absensiId = params.id;
  if (!absensiId) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = await req.json();
  if (!body) {
    return new Response("Bad Request", { status: 400 });
  }
  if (!body.evaluation) {
    return new Response("Bad Request", { status: 400 });
  }
  if (!body.code) {
    return new Response("Forbidden", { status: 403 });
  }
  await prisma.$connect();
  const record = await prisma.attendanceRecord.findFirst({
    where: {
      userId: +userId,
      attendanceId: +absensiId,
    },
  });
  if (record) {
    await prisma.$disconnect();
    return new Response("Already attended", { status: 400 });
  }
  const absensi = await prisma.attendance.findUnique({
    where: { id: +absensiId },
  });
  if (!absensi) {
    await prisma.$disconnect();
    return new Response("Absensi not found", { status: 404 });
  }
  if (absensi.code !== body.code) {
    await prisma.$disconnect();
    return new Response("Forbidden", { status: 403 });
  }
  const deadline = new Date(
    absensi.created_at.getTime() + absensi.expires_in * 1000
  );
  if (deadline < new Date()) {
    await prisma.$disconnect();
    return new Response("Absensi has expired", { status: 400 });
  }
  const attendance = await prisma.attendanceRecord.create({
    data: {
      attendanceId: +absensiId,
      userId: +userId,
    },
  });
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      ...attendance,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
