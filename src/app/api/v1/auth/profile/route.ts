import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidUserResponse } from "@/utils/serverResponse";

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile berhasil didapatkan
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
 *                   example: Profile berhasil didapatkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: danniel@email.com
 *                     name:
 *                       type: string
 *                       example: Danniel
 *                 status:
 *                   type: integer
 *                   example: 200
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
