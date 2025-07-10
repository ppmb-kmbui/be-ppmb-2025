import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextRequest } from "next/server";
import serverResponse from "@/utils/serverResponse";
import * as jwt from "jose";

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: Login user
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: danniel@email.com
 *              password:
 *                type: string
 *                example: dannielsigma
 *    responses:
 *      200:
 *        description: Login berhasil, returns JWT token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: Login berhasil
 *                data:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                status:
 *                  type: integer
 *                  example: 200
 *      404:
 *        description: User tidak ditemukan
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: Login gagal
 *                error:
 *                  type: string
 *                  example: User tidak ditemukan
 *                status:
 *                  type: integer
 *                  example: 404
 *      400:
 *        description: Email atau Password tidak tepat
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: Login gagal
 *                error:
 *                  type: string
 *                  example: Email atau Password tidak tepat
 *                status:
 *                  type: integer
 *                  example: 400
 */

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email: string; password: string };
  await prisma.$connect();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  await prisma.$disconnect();

  if (!user) {
    return serverResponse({success: false, message: "Login gagal", error: "User tidak ditemukan", status: 404});
  }

  const match = await compare(body.password, user.password);
  if (!match) {
    return serverResponse({success: false, message: "Login gagal", error: "Email atau Password tidak tepat", status: 400});
  }
  
  const token = await new jwt.SignJWT({
    sub: "" + user.id,
    is_admin: user.isAdmin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  
  return serverResponse({success: true, message: "Login berhasil", data: {token: token}, status: 200}); 

}
