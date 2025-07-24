import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import serverResponse from "@/utils/serverResponse";

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: danniel@email.com
 *     responses:
 *       200:
 *         description: Token reset dikirim ke email
 *       404:
 *         description: Email tidak ditemukan
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return serverResponse({
      success: false,
      message: "Email tidak ditemukan",
      status: 404,
    });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  return serverResponse({
    success: true,
    message: "Token reset dikirim ke email (simulasi: cek response)",
    data: { token },
    status: 200,
  });
}
