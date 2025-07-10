import { NextRequest } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z, ZodError} from "zod";
import { minLength, success } from "zod/v4";
import serverResponse from "@/utils/serverResponse";
import { Fascinate } from "next/font/google";
import { ValidationError } from "@/types/api-type";

const UserSchema = z.object({
  fullname: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Tolong masukan email yang sesuai"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  imgUrl: z.string(),
  faculty: z.string(),
  batch: z.number(),
});

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Danniel
 *               email:
 *                 type: string
 *                 example: Danniel@email.com
 *               password:
 *                 type: string
 *                 example: DannielSigma
 *               imgUrl:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               faculty:
 *                 type: string
 *                 example: Ilmu Komputer
 *               batch:
 *                 type: integer
 *                 example: 2023
 *     responses:
 *       200:
 *         description: Register success
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already used
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  const body = (await req.json());

  await prisma.$connect();
  try {
    const validateData = UserSchema.parse(body);
    validateData["password"] = await hash(body["password"], 10);

    await prisma.user.create({data: validateData});
    
    const responseData = { ...validateData } as any;
    delete responseData.password;

    await prisma.$disconnect();

    return serverResponse({success: true, message: "Succesfully created an Account", data: responseData})

  } catch (error) {
    await prisma.$disconnect();

    if (error instanceof ZodError) {
      const zodErrors: ValidationError[] = error.errors.map((issue) => ({
        field: issue.path[0]?.toString() || "unknown",
        message: issue.message,
      }));

      return serverResponse({
        success: false,
        message: "Validasi gagal",
        error: zodErrors,
        status: 400,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return serverResponse({
          success: false,
          message: "Email sudah digunakan",
          error: "DUPLICATE_EMAIL",
          status: 409,
        });
      }
    }

    return serverResponse({
      success: false,
      message: "Terjadi kesalahan internal",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    });
  }
}
