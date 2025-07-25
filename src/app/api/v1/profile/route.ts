import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import serverResponse, { InvalidHeadersResponse, InvalidUserResponse } from "@/utils/serverResponse";

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
 *                       type: integer
 *                       example: 7
 *                     email:
 *                       type: string
 *                       example: dennis@gmail.com
 *                     fullname:
 *                       type: string
 *                       example: Dennis 25
 *                     imgUrl:
 *                       type: string
 *                       example: rickRolll
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-08T11:51:35.194Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-08T11:51:35.194Z"
 *                     faculty:
 *                       type: string
 *                       example: Computer Science
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *                     batch:
 *                       type: integer
 *                       example: 2025
 *                     followers:
 *                       type: integer
 *                       example: 4
 *                     networking_tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         example:
 *                           fromId: 7
 *                           toId: 15
 *                           img_url: "https://example.com/image.jpg"
 *                           is_done: true
 *                           score: 0
 *                           questions:
 *                             - questionId: 1
 *                               fromId: 7
 *                               toId: 15
 *                               answer: "Halo cantik wiwiw"
 *                               question:
 *                                 id: 1
 *                                 question: "Jalur masuk UI serta alasan mengambil jurusan tersebut"
 *                                 created_at: "2025-07-14T11:15:45.101Z"
 *                                 updated_at: "2025-07-14T11:15:45.101Z"
 *                                 group_id: 1
 *                             - questionId: 4
 *                               fromId: 7
 *                               toId: 15
 *                               answer: "Halo cantik wiwiw"
 *                               question:
 *                                 id: 4
 *                                 question: "Apa satu kebiasaan kecil yang ingin kamu tingkatkan selama kuliah?"
 *                                 created_at: "2025-07-14T11:15:45.252Z"
 *                                 updated_at: "2025-07-14T11:15:45.252Z"
 *                                 group_id: 2
 *                             - questionId: 6
 *                               fromId: 7
 *                               toId: 15
 *                               answer: "Halo cantik wiwiw"
 *                               question:
 *                                 id: 6
 *                                 question: "Apa cita-cita atau impianmu, dan kenapa memilih itu"
 *                                 created_at: "2025-07-14T11:15:45.252Z"
 *                                 updated_at: "2025-07-14T11:15:45.252Z"
 *                                 group_id: 2
 *                             - questionId: 14
 *                               fromId: 7
 *                               toId: 15
 *                               answer: "Karena gw sangat sangat tampan omaga"
 *                               question:
 *                                 id: 14
 *                                 question: "Mengapa kamu sangat tampan omaga?"
 *                                 created_at: "2025-07-15T08:25:21.955Z"
 *                                 updated_at: "2025-07-15T08:25:21.955Z"
 *                                 group_id: -1
 *                           to:
 *                             id: 15
 *                             email: "vincent@gmail.com"
 *                             fullname: "Vincent 25"
 *                             imgUrl: "shit"
 *                             createdAt: "2025-07-15T08:03:38.632Z"
 *                             updatedAt: "2025-07-15T08:03:38.632Z"
 *                             faculty: "Computer Science"
 *                             isAdmin: false
 *                             batch: 2025
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
 *   put:
 *     summary: Update profil user (hanya imgUrl)
 *     description: Endpoint ini membutuhkan JWT token pada header Authorization. Hanya field imgUrl yang dapat diupdate.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imgUrl:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Berhasil memperbarui profil user
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
 *                   example: Berhasil memperbarui profil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     email:
 *                       type: string
 *                       example: dennis@gmail.com
 *                     fullname:
 *                       type: string
 *                       example: Dennis 25
 *                     imgUrl:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-08T11:51:35.194Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-08T11:51:35.194Z"
 *                     faculty:
 *                       type: string
 *                       example: Computer Science
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *                     batch:
 *                       type: integer
 *                       example: 2025
 *       400:
 *         description: Gagal memperbarui profil (imgUrl wajib diisi)
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
 *                   example: Gagal memperbarui profil
 *                 error:
 *                   type: string
 *                   example: imgUrl wajib
 */
