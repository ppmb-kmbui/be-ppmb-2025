import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import serverResponse from "@/utils/serverResponse";

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password dengan token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: passwordBaru123
 *     responses:
 *       200:
 *         description: Password berhasil direset
 *       400:
 *         description: Token tidak valid atau expired
 */
export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();

  const reset = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!reset || reset.expiresAt < new Date()) {
    return serverResponse({ success: false, message: "Token tidak valid atau expired", status: 400 });
  }

  const password = await hash(newPassword, 10);
  await prisma.user.update({
    where: { id: reset.userId },
    data: { password },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return serverResponse({ success: true, message: "Password berhasil direset", status: 200 });
}