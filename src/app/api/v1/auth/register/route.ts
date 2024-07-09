import { NextRequest } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Prisma.UserCreateInput;
  await prisma.$connect();
  body["password"] = await hash(body["password"], 10);
  const user = await prisma.user.create({ data: body });
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      ...user,
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
