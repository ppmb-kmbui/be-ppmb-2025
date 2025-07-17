import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }
  await prisma.$connect();
  const attendances = await prisma.attendance.findMany();
  await prisma.$disconnect();
  return new Response(JSON.stringify(attendances), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }
  const data = await req.json();
  await prisma.$connect();
  const attendance = await prisma.attendance.create({ data });
  await prisma.$disconnect();
  return new Response(JSON.stringify(attendance), {
    headers: { "Content-Type": "application/json" },
  });
}
