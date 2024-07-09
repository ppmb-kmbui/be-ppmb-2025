import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!params?.id) {
    return new Response("Bad Request", { status: 400 });
  }
  if (!req.body) {
    return new Response("Bad Request", { status: 400 });
  }
  const data = await req.json();
  await prisma.$connect();
  const attendance = await prisma.attendance.update({
    where: { id: +params.id },
    data,
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(attendance), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = !!req.headers.get("X-User-Admin");
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!params?.id) {
    return new Response("Bad Request", { status: 400 });
  }
  await prisma.$connect();
  const attendance = await prisma.attendance.delete({
    where: { id: +params.id },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(attendance), {
    headers: { "Content-Type": "application/json" },
  });
}
