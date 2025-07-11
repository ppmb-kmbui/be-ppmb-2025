import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse, InvalidUserResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  const searchParams = req.nextUrl.searchParams;
  await prisma.$connect;
  if (!searchParams.get("name")) {
    try{
      const friends = await prisma.user.findMany({
        where: {
          id: {
            not: {
              equals: +userId,
            },
          },
        },
        omit: {
          password: true,
        },
        include: {
          ConnectionReciever: {
            where: {
              fromId: +userId,
            },
            select: {
              status: true,
            },
          },
          ConnectionRequestReciever: {
            where: {
              fromId: +userId,
            },
            select: {
              status: true,
            },
          },
          ConnectionRequestSender: {
            where: {
              toId: +userId,
            },
            select: {
              status: true,
            },
          },
          NetworkingTaskReciever: {
            where: {
              fromId: +userId,
            },
            select: {
              is_done: true,
            },
          },
          NetworkingKatingTaskReceiver: {
            where: {
              fromId: +userId,
            },
            select: {
              is_done: true,
            },
          }
        },
      });

      const friends_response = {
          friends: friends.map(
            ({
              ConnectionReciever,
              ConnectionRequestReciever,
              ConnectionRequestSender,
              NetworkingTaskReciever,
              NetworkingKatingTaskReceiver,
              createdAt,
              ...rest
            }) => {
              let status = "not_connected";
              if (NetworkingTaskReciever.length || NetworkingKatingTaskReceiver.length) {
                status = NetworkingTaskReciever[0].is_done || NetworkingKatingTaskReceiver[0].is_done
                  ? "done"
                  : "sedang_networking";
              } else if (ConnectionReciever.length) {
                status = ConnectionReciever[0].status;
              } else if (ConnectionRequestReciever.length) {
                status = "menunggu_konfirmasi";
              } else if (ConnectionRequestSender.length) {
                status = "meminta_konfirmasi";
              }
              return {
                ...rest,
                status,
              };
            }
          ),
        }
      return serverResponse({success: true, message: "Friends Succesfully retrieved", data: friends_response ,status: 200})
    } catch {
      return InvalidUserResponse;
    }
  }

  const name = `%${searchParams.get("name")}%`;
  const person: { id: string }[] = await prisma.$queryRaw `SELECT id FROM users WHERE fullname LIKE ${name}`;
  
  if (!person?.length) {
    return serverResponse({success: true, message: "Friends Succesfully retrieved but it is empty", data: [] ,status: 200})
  }

  try {
    const friends = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: {
                equals: +userId,
              },
            },
          },
          {
            OR: person.map(({ id }) => ({
              id: +id,
            })),
          },
        ],
      },
      omit: {
        password: true,
      },
      include: {
        ConnectionReciever: {
          where: {
            fromId: +userId,
          },
          select: {
            status: true,
          },
        },
        ConnectionRequestReciever: {
          where: {
            fromId: +userId,
          },
          select: {
            status: true,
          },
        },
        ConnectionRequestSender: {
          where: {
            toId: +userId,
          },
          select: {
            status: true,
          },
        },
        NetworkingTaskReciever: {
          where: {
            fromId: +userId,
          },
          select: {
            is_done: true,
          },
        },
        NetworkingKatingTaskReceiver: {
            where: {
              fromId: +userId,
            },
            select: {
              is_done: true,
            },
          },
      },
    });
    await prisma.$disconnect();
    
    const friends_response = {
        friends: friends.map(
          ({
            ConnectionReciever,
            ConnectionRequestReciever,
            ConnectionRequestSender,
            NetworkingTaskReciever,
            NetworkingKatingTaskReceiver,
            createdAt,
            ...rest
          }) => {
            let status = "not_connected";
            if (NetworkingTaskReciever.length) {
              status = NetworkingTaskReciever[0].is_done || NetworkingKatingTaskReceiver[0].is_done
                ? "done"
                : "sedang_networking";
            } else if (ConnectionReciever.length) {
              status = ConnectionReciever[0].status;
            } else if (ConnectionRequestReciever.length) {
              status = "menunggu_konfirmasi";
            } else if (ConnectionRequestSender.length) {
              status = "meminta_konfirmasi";
            }
            return {
              ...rest,
              status,
            };
          }
        ),
      };
    return serverResponse({success: true, message: `Friends Succesfully retrieved with name ${name}`, data: friends_response ,status: 200})
  } catch {
    return InvalidUserResponse;
  }
}
