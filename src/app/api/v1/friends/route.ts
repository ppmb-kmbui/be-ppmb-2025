import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = `%${searchParams.get("name")}%`;
  if (!searchParams.get("name")) {
    const friends = await prisma.user.findMany();
    return new Response(
      JSON.stringify({
        friends,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  await prisma.$connect();

  const friends = await prisma.$queryRaw`
  SELECT id, email, fullname, faculty, img_url
  FROM users
  WHERE fullname ILIKE ${name}
  `;
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      friends,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
