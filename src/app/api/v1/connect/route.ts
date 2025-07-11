import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse, InvalidUserResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  try{
    const connections = await prisma.connection.findMany({
      where: {
        fromId: +userId,
      },
      include: {
        to: {
          omit: {
            password: false,
          },
        },
        from: {
          omit: {
            password: false,
          },
        },
      },
    });
    await prisma.$disconnect();
    return serverResponse({success: true, message: "Succesfully retrieved all connection", data: connections, status: 200});
  } catch (error) {
    await prisma.$disconnect();
    return InvalidUserResponse;
  }
}
