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
  if (!params.id) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = await req.json();
  await prisma.$connect();
  switch (+params.id) {
    case 1: {
      const exist = await prisma.firstMentoringReflection.findFirst({
        where: { userId: +userId },
      });
      if (exist) {
        const sub = await prisma.firstMentoringReflection.updateMany({
          where: { userId: +userId },
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
      const sub = await prisma.firstMentoringReflection.create({
        data: {
          ...body,
          userId: +userId,
        },
      });
      await prisma.$disconnect();
      return new Response(JSON.stringify(sub), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    case 2: {
      const exist = await prisma.secondMentoringReflection.findFirst({
        where: { userId: +userId },
      });
      if (exist) {
        const sub = await prisma.secondMentoringReflection.updateMany({
          where: { userId: +userId },
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
      const sub = await prisma.secondMentoringReflection.create({
        data: {
          ...body,
          userId: +userId,
        },
      });
      await prisma.$disconnect();
      return new Response(JSON.stringify(sub), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    case 3: {
      const exist = await prisma.thirdMentoringReflection.findFirst({
        where: { userId: +userId },
      });
      if (exist) {
        const sub = await prisma.thirdMentoringReflection.updateMany({
          where: { userId: +userId },
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
      const sub = await prisma.thirdMentoringReflection.create({
        data: {
          ...body,
          userId: +userId,
        },
      });
      await prisma.$disconnect();
      return new Response(JSON.stringify(sub), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    case 4: {
      const exist = await prisma.fourthMentoringReflection.findFirst({
        where: { userId: +userId },
      });
      if (exist) {
        const sub = await prisma.fourthMentoringReflection.updateMany({
          where: { userId: +userId },
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
      const sub = await prisma.fourthMentoringReflection.create({
        data: {
          ...body,
          userId: +userId,
        },
      });
      await prisma.$disconnect();
      return new Response(JSON.stringify(sub), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    default: {
      return new Response("Bad Request", { status: 400 });
    }
  }
}
