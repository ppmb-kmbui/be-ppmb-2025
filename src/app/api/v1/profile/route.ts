import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import serverResponse, { InvalidHeadersResponse, InvalidUserResponse } from "@/utils/serverResponse";

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Ambil profil user (dengan followers dan networking tasks)
 *     description: Endpoint ini membutuhkan JWT token pada header Authorization. Token akan divalidasi oleh middleware, dan userId akan diambil dari JWT.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil profil user
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
 *                   example: Berhasil mengambil profil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: clwq1k2z90000v3l5b8k3z9k1
 *                     fullname:
 *                       type: string
 *                       example: Danniel
 *                     email:
 *                       type: string
 *                       example: danniel@email.com
 *                     imgUrl:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     faculty:
 *                       type: string
 *                       example: Ilmu Komputer
 *                     batch:
 *                       type: integer
 *                       example: 2023
 *                     followers:
 *                       type: integer
 *                       example: 10
 *                     networking_tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Tidak diizinkan (JWT tidak valid atau header tidak ditemukan)
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
 *                   example: Tidak diizinkan
 *                 error:
 *                   type: string
 *                   example: JWT Token tidak valid
 */

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  await prisma.$connect();
  const user = await prisma.user.findUnique({
    where: {
      id: +userId,
    },
    include: {
      _count: {
        select: {
          ConnectionReciever: true,
        },
      },
      NetworkingTaskSender: {
        where: {
          fromId: +userId,
          is_done: true,
        },
        include: {
          questions: {
            include: {
              question: true,
            },
          },
          to: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
    omit: {
      password: true,
    },
  });
  await prisma.$disconnect();

  if (!user) {
    return InvalidUserResponse;
  }

  const { NetworkingTaskSender, _count, ...rest } = user;

  return serverResponse({
    success: true,
    message: "Berhasil mengambil profil",
    data: {
      ...rest,
      followers: _count.ConnectionReciever,
      networking_tasks: NetworkingTaskSender,
    },
    status: 200,
  });
}

export async function PUT(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return InvalidHeadersResponse;
  }
  const body = await req.json();
  if (!body.imgUrl) {
    return serverResponse({
      success: false,
      message: "Gagal memperbarui profil",
      error: "imgUrl wajib diisi",
      status: 400,
    });
  }
  await prisma.$connect();
  const user = await prisma.user.update({
    where: {
      id: +userId,
    },
    data: {
      imgUrl: body.imgUrl,
    },
    omit: {
      password: true,
    },
  });
  await prisma.$disconnect();

  return serverResponse({
    success: true,
    message: "Berhasil memperbarui profil",
    data: user,
    status: 200,
  });
}