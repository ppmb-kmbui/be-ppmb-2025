import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!params.id) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = await req.json();
  await prisma.$connect();
  const sub = await prisma.connectSubmission.update({
    where: { id: +params.id },
    data: {
      ...body,
    },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(sub), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!params.id) {
    return new Response("Bad Request", { status: 400 });
  }
  await prisma.$connect();
  const sub = await prisma.connectSubmission.delete({
    where: { id: +params.id },
  });
  await prisma.$disconnect();
  return new Response(JSON.stringify(sub), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
