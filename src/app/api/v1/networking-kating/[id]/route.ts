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

export async function PUT(req: NextRequest, { params }: { params: Promise<{id: string}>}) {
    const userId = req.headers.get('X-User-Id');
    const targetId = (await params).id;

    const body = (await req.json()) as SubmitAnswerNetworkingKatingTaskDto;
        
    if (!body.img_url || !body.answers || !body.optionalAnswes) {
        return serverResponse({
            success: false, 
            message: "Operasi gagal", 
            error: "Request body tidak lengkap", 
            data: {
                template: {
                    img_url: "string",
                    answers: [
                        { 
                            answer: "string" 
                        }
                    ],
                    optionalAnswes: {
                        question: "string",
                        answer: "string"
                    }
                }
            },
        });
    }
    
    if (body.answers.length !== 7) {
        return serverResponse({success: false, message: "Operasi gagal", error: "Banyak pertanyaan seharusnya 7"});
    }

    await prisma.$connect;

    const response = await checkUser(userId, targetId);
    if (response !== null) return response;

    const networkingKating = await prisma.networkingKatingTask.findFirst({
        where: {
            fromId: +userId!,
            toId: +targetId
        },
        include: {
            questions: true
        }
    });
    
    if (!networkingKating) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Anda belum mengambil pertanyaan dari kating ini", status: 400});
    }

    const newQuestion = await prisma.questionKating.create({
        data: {
            question: body.optionalAnswes.question,
            group_id: -1
        }
    });

    await prisma.questionKatingTask.create({
        data: {
            fromId: +userId!,
            toId: +targetId,
            questionId: newQuestion.id,
            answer: body.optionalAnswes.answer
        }
    });

    await prisma.$transaction(
        body.answers.map((answerObj, idx) =>
            prisma.questionKatingTask.update({
                where: {
                    questionId_fromId_toId: {
                        questionId: idx + 1,
                        fromId: +userId!,
                        toId: +targetId,
                    },
                },
                data: {
                    answer: answerObj.answer,
                },
            })
        )
    );

    const networkingKatingAnswer = await prisma.networkingKatingTask.update({
        where: {
            fromId_toId: {
                fromId: +userId!,
                toId: +targetId
            }
        },
        data: {
            img_url: body.img_url,
            is_done: true,  
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
        },
    });

    await prisma.connection.updateMany({
        where: {
            fromId: +userId!,
            toId: +targetId,
        },
        data: {
            status: "done",
        },
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
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "User tidak ditemukan", status: 404});
    }

    if (user.batch !== 2025) {
        await prisma.$disconnect;
        return serverResponse({success: false, message: "Operasi gagal", error: "Khusus mahasiswa baru saja", status: 400});
    }

    return null;
}