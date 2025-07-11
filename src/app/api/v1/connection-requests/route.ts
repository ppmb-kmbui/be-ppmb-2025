import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse, InvalidUserResponse } from "@/utils/serverResponse";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  try{
    const connection_requests_recieved = await prisma.connectionRequest.findMany({
      where: {
        toId: +userId,
      },
      include: {
        from: {
          select: {
            id: true,
            email: true,
            fullname: true,
            faculty: true,
            imgUrl: true,
          },
        },
      },
    });
    const connection_requests_sent = await prisma.connectionRequest.findMany({
      where: {
        fromId: +userId,
      },
      include: {
        to: {
          select: {
            id: true,
            email: true,
            fullname: true,
            faculty: true,
            imgUrl: true,
          },
        },
      },
    });
    await prisma.$disconnect();
    return serverResponse({success: true, message: "Succesfully retrieved all connection request", data: {received: connection_requests_recieved, sent: connection_requests_sent}, status: 200});
    
    return new Response(
      JSON.stringify({
        connection_requests_recieved,
        connection_requests_sent,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await prisma.$disconnect;
    return InvalidUserResponse;
  }
}
