import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextRequest } from "next/server";
import * as jwt from "jose";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email: string; password: string };
  await prisma.$connect();
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });
  await prisma.$disconnect();
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  // const match = await compare(body.password, user.password);
  // if (!match) {
  //   return new Response("Invalid email or password", { status: 400 });
  // }
  const token = await new jwt.SignJWT({
    sub: "" + user.id,
    is_admin: user.isAdmin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return new Response(
    JSON.stringify({
      token,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
