import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/networking-kating/{id}:
 *   get:
 *     summary: Ambil detail networking kating dengan user tertentu
 *     description: |
 *       Endpoint ini membutuhkan Bearer JWT token pada header Authorization.
 *       Mengembalikan detail networking task dengan kakak tingkat yang sudah dilakukan oleh mahasiswa baru (batch 2025).
 *     tags:
 *       - Networking Kating
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID target user (kakak tingkat)
 *     responses:
 *       200:
 *         description: Networking Kating berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Networking Kating berhasil didapatkan }
 *                 data:
 *                   type: object
 *                 status: { type: integer, example: 200 }
 *       400:
 *         description: Operasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Operasi gagal }
 *                 error: { type: string, example: Khusus mahasiswa baru saja }
 *                 status: { type: integer, example: 400 }
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Operasi gagal }
 *                 error: { type: string, example: User tidak ditemukan }
 *                 status: { type: integer, example: 404 }
 *
 *   post:
 *     summary: Submit jawaban networking kating dengan kakak tingkat
 *     description: |
 *       Endpoint ini membutuhkan Bearer JWT token pada header Authorization.
 *       Submit jawaban networking kating dengan kakak tingkat (id di path).
 *       Mahasiswa baru wajib mengisi 7 jawaban pertanyaan tetap dan 1 optional.
 *     tags:
 *       - Networking Kating
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID target user (kakak tingkat)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               img_url: { type: string, example: https://example.com/networking.jpg }
 *               answers:
 *                 type: array
 *                 minItems: 7
 *                 maxItems: 7
 *                 items:
 *                   type: object
 *                   properties:
 *                     answer: { type: string, example: Jawaban saya }
 *               optionalAnswes:
 *                 type: object
 *                 properties:
 *                   question: { type: string, example: Pertanyaan tambahan }
 *                   answer: { type: string, example: Jawaban tambahan }
 *     responses:
 *       200:
 *         description: Berhasil submit networking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Berhasil submit networking }
 *                 data:
 *                   type: object
 *                 status: { type: integer, example: 200 }
 *       400:
 *         description: Request body tidak lengkap atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Operasi gagal }
 *                 error: { type: string, example: Banyak pertanyaan seharusnya 7 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     template:
 *                       type: object
 *                       properties:
 *                         img_url: { type: string, example: string }
 *                         answers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               answer: { type: string, example: string }
 *                         optionalAnswes:
 *                           type: object
 *                           properties:
 *                             question: { type: string, example: string }
 *                             answer: { type: string, example: string }
 *                 status: { type: integer, example: 400 }
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Operasi gagal }
 *                 error: { type: string, example: User tidak ditemukan }
 *                 status: { type: integer, example: 404 }
 */

export async function GET(req: NextRequest, { params }: {params: Promise<{id: string}>}) {
    const userId = req.headers.get('X-User-Id');
    const targetId = (await params).id;
    await prisma.$connect();

    const response = await checkUser(userId, targetId);
    if (response !== null) return response;

    const networkingKating = await prisma.networkingKatingTask.findFirst({
        where: {
            fromId: +userId!,
            toId: +targetId
        },
        include: {
            to: true,
            from: {
                omit: {
                    password: true,
                },
            },
            questions: true
        }
    });
    
    if (!networkingKating) {
        await prisma.$disconnect();
        return serverResponse({success: false, message: "Operasi gagal", error: "Anda belum networking dari kating ini", status: 400});
    }

    return serverResponse({success: true, message: "Networking Kating berhasil didapatkan", data: networkingKating});
}

interface SubmitAnswerNetworkingKatingTaskDto {
    img_url: string,
    answers: {
        answer: string
    } [],
    optionalAnswes: {
        question: string,
        answer: string
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = req.headers.get('X-User-Id');
    const targetId = (await params).id;

    let body: SubmitAnswerNetworkingKatingTaskDto;
    try {
        body = await req.json();
    } catch {
        return serverResponse({
            success: false,
            message: "Operasi gagal",
            error: "Request body tidak valid",
            status: 400
        });
    }

    const template = {
        img_url: "string",
        answers: [{ answer: "string" }],
        optionalAnswes: { question: "string", answer: "string" }
    };

    if (!body.img_url || !body.answers || !body.optionalAnswes) {
        return serverResponse({
            success: false,
            message: "Operasi gagal",
            error: "Request body tidak lengkap",
            data: { template },
            status: 400

        });
    }

    if (body.answers.length !== 7) {
        return serverResponse({
            success: false,
            message: "Operasi gagal",
            error: "Banyak pertanyaan seharusnya 7",
            data: { template },
            status: 400
        });
    }

    await prisma.$connect();

    const userCheck = await checkUser(userId, targetId);
    if (userCheck !== null) {
        await prisma.$disconnect();
        return userCheck;
    }

    const senior = await prisma.seniorUser.findFirst({ where: { id: +targetId } });
    if (!senior) {
        await prisma.$disconnect();
        return serverResponse({
            success: false,
            message: "Operasi gagal",
            error: "Kating tidak ditemukan",
            status: 400
        });
    }
    
    await prisma.networkingKatingTask.upsert({
        where: {
            fromId_toId: {
                fromId: +userId!,
                toId: +targetId
            }
        },
        update: {},
        create: {
            fromId: +userId!,
            toId: +targetId
        }
    });

    const newQuestion = await prisma.questionKating.create({
        data: {
            question: body.optionalAnswes.question,
            group_id: -1
        }
    });

    const questionTasks = [
        prisma.questionKatingTask.create({
            data: {
                fromId: +userId!,
                toId: +targetId,
                questionId: newQuestion.id,
                answer: body.optionalAnswes.answer
            }
        }),
        ...body.answers.map((answerObj, idx) =>
            prisma.questionKatingTask.create({
                data: {
                    questionId: idx + 1,
                    fromId: +userId!,
                    toId: +targetId,
                    answer: answerObj.answer,
                }
            })
        )
    ];

    await prisma.$transaction(questionTasks);

    const networkingKatingAnswer = await prisma.networkingKatingTask.update({
        where: {
            fromId_toId: {
                fromId: +userId!,
                toId: +targetId
            }
        },
        data: { img_url: body.img_url },
        include: {
            to: true,
            from: { omit: { password: true } },
            questions: { include: { question: true } }
        }
    });

    await prisma.$disconnect();

    return serverResponse({
        success: true,
        message: "Berhasil submit networking",
        data: networkingKatingAnswer,
        status: 200
    });
}

async function checkUser(userId: string | null, targetId: string | null) {
    if (!userId || !targetId) {
        return InvalidHeadersResponse;
    } 

    const user = await prisma.user.findFirst({
        where: {
            id: +userId
        }
    });

    if (!user) {
        await prisma.$disconnect();
        return serverResponse({success: false, message: "Operasi gagal", error: "User tidak ditemukan", status: 404});
    }

    if (user.batch !== 2025) {
        await prisma.$disconnect();
        return serverResponse({success: false, message: "Operasi gagal", error: "Khusus mahasiswa baru saja", status: 400});
    }

    return null;
}
