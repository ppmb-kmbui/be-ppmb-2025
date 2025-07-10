import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidUserResponse } from "@/utils/serverResponse";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidUserResponse;
  }
  await prisma.$connect();
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });
    await prisma.$disconnect();
    const { password, ...profile } = user!;
    return serverResponse({success: true, message: "Profile berhasil didapatkan", data: profile});

  } catch (error) {
    await prisma.$disconnect();
    return InvalidUserResponse;
  } 
}
