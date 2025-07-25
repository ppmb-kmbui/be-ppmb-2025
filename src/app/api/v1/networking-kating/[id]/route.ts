import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { create } from "domain";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: {params: Promise<{id: string}>}) {
    const userId = req.headers.get('X-User-Id');
    const targetId = (await params).id;
    await prisma.$connect;

    const response = await checkUser(userId, targetId);
    if (response !== null) return response;

    const networkingKating = await prisma.networkingKatingTask.findFirst({
        where: {
            fromId: +userId!,
            toId: +targetId
        },
        include: {
            to: {
                omit: {
                    password: true,
                },
            },
            from: {
                omit: {
                    password: true,
                },
            },
            questions: true
        }
    });
    
    if (!networkingKating) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Anda belum mengambil pertanyaan dari kating ini", status: 400});
    }

    return serverResponse({success: true, message: "Networking Kating berhasil didapatkan", data: networkingKating});
}

export async function POST(req: NextRequest, { params }: {params: Promise<{id: string}>}) {
    const userId = req.headers.get('X-User-Id');
    const targetId = (await params).id;
    await prisma.$connect;

    const response = await checkUser(userId, targetId);
    if (response !== null) return response;

    const friends = await prisma.connection.findFirst({
        where: {
            fromId: +userId!,
            toId: +targetId
        }
    })

    if (!friends) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Anda belum berteman dengan user ini", status: 400});
    } 

    const networkingKating = await prisma.networkingKatingTask.findFirst({
        where: {
            fromId: +userId!,
            toId: +targetId
        }
    });
    
    if (networkingKating) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Anda sudah mendapatkan pertanyaan dari kating ini", status: 400});
    }

    const numberOfQuestions: number = await prisma.questionKating.count({
        where: {
            id: {
                gte: 1,
                lte: 7
            }
        }
    });

    if (numberOfQuestions !== 7) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Pertanyaan dalam DB tidak cukup", status: 500});
    } 

    const newNetworkingKating = await prisma.networkingKatingTask.create({
        data: {
            fromId: +userId!,
            toId: +targetId!,
            questions: {
                create: [
                    { questionId: 1 },
                    { questionId: 2 },
                    { questionId: 3 },
                    { questionId: 4 },
                    { questionId: 5 },
                    { questionId: 6 },
                    { questionId: 7 }
                ]
            }
        }, 
        include: {
            to: {
                omit: {
                    password: true,
                },
            },
            from: {
                omit: {
                    password: true,
                },
            },
            questions: {
                include: {
                    question: true,
                },
            },
        }
    });

    await prisma.$disconnect;
    return serverResponse({success: true, message: "Networking kating berhasil dibuat", data: newNetworkingKating, status: 200});
}

// interface SubmitAnswerNetworkingKatingTaskDto {
//     img_url: string,
//     answers: {
//         answer: string
//     } [],
//     optionalAnswes: {
//         question: string,
//         answer: string
//     }
// }

// export async function PUT(req: NextRequest, { params }: { params: Promise<{id: string}>}) {
//     const userId = req.headers.get('X-User-Id');
//     const targetId = (await params).id;

//     const body = (await req.json()) as SubmitAnswerNetworkingKatingTaskDto;
        
//     if (!body.img_url || !body.answers || !body.optionalAnswes) {
//         return serverResponse({
//             success: false, 
//             message: "Operasi gagal", 
//             error: "Request body tidak lengkap", 
//             data: {
//                 template: {
//                     img_url: "string",
//                     answers: [
//                         { 
//                             answer: "string" 
//                         }
//                     ],
//                     optionalAnswes: {
//                         question: "string",
//                         answer: "string"
//                     }
//                 }
//             },
//         });
//     }
    
//     if (body.answers.length !== 7) {
//         return serverResponse({success: false, message: "Operasi gagal", error: "Banyak pertanyaan seharusnya 7"});
//     }

//     await prisma.$connect;

//     const response = await checkUser(userId, targetId);
//     if (response !== null) return response;

//     const networkingKating = await prisma.networkingKatingTask.findFirst({
//         where: {
//             fromId: +userId!,
//             toId: +targetId
//         },
//         include: {
//             questions: true
//         }
//     });
    
//     if (!networkingKating) {
//         await prisma.$disconnect;
//         return serverResponse({success: false, message: "Operasi gagal", error: "Anda belum mengambil pertanyaan dari kating ini", status: 400});
//     }

//     const newQuestion = await prisma.questionKating.create({
//         data: {
//             question: body.optionalAnswes.question,
//             group_id: -1
//         }
//     });

//     await prisma.questionKatingTask.create({
//         data: {
//             fromId: +userId!,
//             toId: +targetId,
//             questionId: newQuestion.id,
//             answer: body.optionalAnswes.answer
//         }
//     });

//     await prisma.$transaction(
//         body.answers.map((answerObj, idx) =>
//             prisma.questionKatingTask.update({
//                 where: {
//                     questionId_fromId_toId: {
//                         questionId: idx + 1,
//                         fromId: +userId!,
//                         toId: +targetId,
//                     },
//                 },
//                 data: {
//                     answer: answerObj.answer,
//                 },
//             })
//         )
//     );

//     const networkingKatingAnswer = await prisma.networkingKatingTask.update({
//         where: {
//             fromId_toId: {
//                 fromId: +userId!,
//                 toId: +targetId
//             }
//         },
//         data: {
//             img_url: body.img_url,
//             is_done: true,  
//         }, 
//         include: {
//             to: {
//                 omit: {
//                     password: true,
//                 },
//             },
//             from: {
//                 omit: {
//                     password: true,
//                 },
//             },
//             questions: {
//                 include: {
//                     question: true,
//                 },
//             },
//         },
//     });

//     await prisma.connection.updateMany({
//         where: {
//             fromId: +userId!,
//             toId: +targetId,
//         },
//         data: {
//             status: "done",
//         },
//     });

//     await prisma.$disconnect();

//     return serverResponse({
//         success: true, 
//         message: "Berhasil submit networking",
//         data: networkingKatingAnswer,
//         status: 200
//     });
// }

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
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "User tidak ditemukan", status: 404});
    }

    if (user.batch !== 2025) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Khusus mahasiswa baru saja", status: 400});
    }

    return null;
}

/**
 * @swagger
 * /api/v1/networking-kating/{id}:
 *   get:
 *     summary: Ambil detail networking kating dengan user tertentu
 *     description: |
 *       Endpoint ini membutuhkan JWT token pada header Authorization (format: Bearer &lt;token&gt;).
 *       Mengembalikan detail networking task dengan kakak tingkat yang sudah dilakukan.
 *       Khusus untuk mahasiswa baru (batch 2025). Question bisa 7 atau 8, Jika 7 berati masih belum menjawab tapi 8 berati sudah menjawab karena user sudah memberikan optional question nya
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
 *         description: ID target user (kakak tingkat) untuk networking
 *     responses:
 *       200:
 *         description: Networking Kating berhasil didapatkan
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
 *                   example: Networking Kating berhasil didapatkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     fromId:
 *                       type: integer
 *                       example: 1
 *                     toId:
 *                       type: integer
 *                       example: 2
 *                     img_url:
 *                       type: string
 *                       example: https://example.com/networking.jpg
 *                     is_done:
 *                       type: boolean
 *                       example: true
 *                     score:
 *                       type: integer
 *                       example: 85
 *                     to:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         email:
 *                           type: string
 *                           example: kating@email.com
 *                         fullname:
 *                           type: string
 *                           example: Kakak Tingkat
 *                         faculty:
 *                           type: string
 *                           example: Ilmu Komputer
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionId:
 *                             type: integer
 *                             example: 1
 *                           answer:
 *                             type: string
 *                             example: Jawaban pertanyaan
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Operasi gagal
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
 *                   example: Operasi gagal
 *                 error:
 *                   type: string
 *                   example: Anda belum mengambil pertanyaan dari kating ini
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
 *                   example: Operasi gagal
 *                 error:
 *                   type: string
 *                   example: User tidak ditemukan
 *                 status:
 *                   type: integer
 *                   example: 404
 *
 *   post:
 *     summary: Buat networking kating baru dengan kakak tingkat
 *     description: |
 *       Endpoint ini membutuhkan JWT token pada header Authorization (format: Bearer &lt;token&gt;).
 *       Membuat networking task baru dengan kakak tingkat dan memberikan 7 pertanyaan tetap.
 *       Khusus untuk mahasiswa baru (batch 2025) yang sudah berteman dengan target user. Ada 7 pertanyaan di answers
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
 *         description: ID target user (kakak tingkat) untuk networking
 *     responses:
 *       200:
 *         description: Networking kating berhasil dibuat
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
 *                   example: Networking kating berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     fromId:
 *                       type: integer
 *                       example: 1
 *                     toId:
 *                       type: integer
 *                       example: 2
 *                     img_url:
 *                       type: string
 *                       example: null
 *                     is_done:
 *                       type: boolean
 *                       example: false
 *                     score:
 *                       type: integer
 *                       example: 0
 *                     to:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         email:
 *                           type: string
 *                           example: kating@email.com
 *                         fullname:
 *                           type: string
 *                           example: Kakak Tingkat
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionId:
 *                             type: integer
 *                             example: 1
 *                           answer:
 *                             type: string
 *                             example: null
 *                           question:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               question:
 *                                 type: string
 *                                 example: Apa hobi kamu?
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Operasi gagal
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
 *                   example: Operasi gagal
 *                 error:
 *                   type: string
 *                   example: Anda belum berteman dengan user ini
 *                 status:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Server error
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
 *                   example: Operasi gagal
 *                 error:
 *                   type: string
 *                   example: Pertanyaan dalam DB tidak cukup
 *                 status:
 *                   type: integer
 *                   example: 500
 * 
 *   put:
 *     summary: Submit jawaban networking kating
 *     description: |
 *       Endpoint ini membutuhkan JWT token pada header Authorization (format: Bearer &lt;token&gt;).
 *       Submit jawaban untuk networking task dengan kakak tingkat.
 *       Khusus untuk mahasiswa baru (batch 2025). Ada 7 pertanyaan di answers
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
 *         description: ID target user (kakak tingkat) untuk networking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               img_url:
 *                 type: string
 *                 example: https://example.com/networking.jpg
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     answer:
 *                       type: string
 *                       example: Jawaban saya
 *                 minItems: 7
 *                 maxItems: 7
 *               optionalAnswes:
 *                 type: object
 *                 properties:
 *                   question:
 *                     type: string
 *                     example: Pertanyaan tambahan
 *                   answer:
 *                     type: string
 *                     example: Jawaban tambahan
 *     responses:
 *       200:
 *         description: Berhasil submit networking
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
 *                   example: Berhasil submit networking
 *                 data:
 *                   type: object
 *                   properties:
 *                     fromId:
 *                       type: integer
 *                       example: 1
 *                     toId:
 *                       type: integer
 *                       example: 2
 *                     img_url:
 *                       type: string
 *                       example: https://example.com/networking.jpg
 *                     is_done:
 *                       type: boolean
 *                       example: true
 *                     score:
 *                       type: integer
 *                       example: 0
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Request body tidak lengkap atau tidak valid
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
 *                   example: Operasi gagal
 *                 error:
 *                   type: string
 *                   example: Banyak pertanyaan seharusnya 7
 *                 data:
 *                   type: object
 *                   properties:
 *                     template:
 *                       type: object
 *                       properties:
 *                         img_url:
 *                           type: string
 *                           example: string
 *                         answers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               answer:
 *                                 type: string
 *                                 example: string
 *                         optionalAnswes:
 *                           type: object
 *                           properties:
 *                             question:
 *                               type: string
 *                               example: string
 *                             answer:
 *                               type: string
 *                               example: string
 */