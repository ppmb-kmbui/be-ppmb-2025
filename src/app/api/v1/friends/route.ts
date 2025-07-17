import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse, InvalidUserResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/friends:
 *   get:
 *     summary: Ambil daftar teman (selain diri sendiri, bisa search by name)
 *     description: Endpoint ini membutuhkan JWT token pada header Authorization (format: Bearer &lt;token&gt;). Token akan divalidasi oleh middleware, dan userId akan diambil dari JWT. Jika diberikan query `name`, maka hasil akan difilter berdasarkan nama.
 *     tags:
 *       - Friends
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Nama teman yang ingin dicari (opsional)
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar teman
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Friends Succesfully retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     friends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           email:
 *                             type: string
 *                             example: danniel@email.com
 *                           fullname:
 *                             type: string
 *                             example: Danniel
 *                           faculty:
 *                             type: string
 *                             example: Ilmu Komputer
 *                           imgUrl:
 *                             type: string
 *                             example: https://example.com/avatar.jpg
 *                           batch:
 *                             type: integer
 *                             example: 2023
 *                           status:
 *                             type: string
 *                             example: not_connected
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Header tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Not Authorized
 *                 error:
 *                   type: string
 *                   example: Headers tidak ditemukan
 *                 status:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid
 *                 error:
 *                   type: string
 *                   example: User tidak ditemukan
 *                 status:
 *                   type: integer
 *                   example: 404
 */

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
