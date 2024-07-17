import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const searchParams = req.nextUrl.searchParams;
  const name = `%${searchParams.get("name")}%`;
  if (!searchParams.get("name")) {
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
      },
    });

    return new Response(
      JSON.stringify({
        friends: friends.map(
          ({
            ConnectionReciever,
            ConnectionRequestReciever,
            ConnectionRequestSender,
            NetworkingTaskReciever,
            createdAt,
            ...rest
          }) => {
            let status = "not_connected";
            if (NetworkingTaskReciever.length) {
              status = NetworkingTaskReciever[0].is_done
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
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  await prisma.$connect();

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
          fullname: {
            contains: name,
          },
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
    },
  });
  await prisma.$disconnect();
  return new Response(
    JSON.stringify({
      friends: friends.map(
        ({
          ConnectionReciever,
          ConnectionRequestReciever,
          ConnectionRequestSender,
          NetworkingTaskReciever,
          createdAt,
          ...rest
        }) => {
          let status = "not_connected";
          if (NetworkingTaskReciever.length) {
            status = NetworkingTaskReciever[0].is_done
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
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
