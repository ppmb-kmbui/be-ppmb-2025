import { prisma } from "@/lib/prisma";
import serverResponse, { InvalidHeadersResponse } from "@/utils/serverResponse";
import { NextRequest } from "next/server";
import { Result } from "postcss";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  const targetId = params.id;

  if (!userId || !targetId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect();

  const connection = await prisma.networkingTask.findUnique({
    where: {
      fromId_toId: {
        fromId: +userId,
        toId: +targetId,
      },
    },
    include: {
      questions: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!connection) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Data gagal diambil", error: "Anda tidak terhubung dengan user ini!", status: 404});
  } else {
    return serverResponse({success: true, message: "Informasi berhasil diperoleh!", data: connection, status: 200})
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  const targetId = params.id;

  if (!userId || !targetId) {
    return InvalidHeadersResponse;
  }

  await prisma.$connect();
  const connection = await prisma.connection.findFirst({
    where: {
      fromId: +userId,
      toId: +targetId,
    },
  });

  if (!connection) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Operasi gagal", error: "Anda tidak terhubung dengan user ini!", status: 400});
  }

  const networking = await prisma.networkingTask.findUnique({
    where: {
      fromId_toId: {
        fromId: +userId,
        toId: +targetId,
      },
    },
    include: {
      questions: {
        include: {
          question: true,
        },
      },
    },
  });

  if (networking) {
    await prisma.$disconnect();
    return serverResponse({success: true, message: "Operasi gagal", error: "Anda sudah networking dengan user ini", status: 400})
  }

  const firstRandomQuestions = await prisma.question.findMany({
    where: {
      group_id: 1,
    }
  });

  if (firstRandomQuestions.length < 1) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Operasi gagal", error: "Pertanyaan dalam DB tidak cukup", status: 400});
  }

  const randomNumber: number = Math.floor(Math.random() * firstRandomQuestions.length);

  const q1 = firstRandomQuestions[randomNumber].id;

  const newTask = await prisma.networkingTask.create({
    data: {
      fromId: +userId,
      toId: +targetId,
    },
  });

  await prisma.questionTask.create({
    data: {
      fromId: newTask.fromId, 
      toId: newTask.toId, 
      questionId: q1
    },
  });

  const twoRandomQuestion = await prisma.question.findMany({
    where: {
      group_id: 2,
    },
  });

  if (twoRandomQuestion.length < 1) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Operasi gagal", error: "Pertanyaan dalam DB tidak cukup", status: 400});
  }

  let firstRandom: number = Math.floor(Math.random() * twoRandomQuestion.length) 
  let secondRandom: number = Math.floor(Math.random() * twoRandomQuestion.length) 
  secondRandom = (secondRandom === firstRandom) ? (secondRandom + 1) % twoRandomQuestion.length : secondRandom;

  await prisma.$transaction([
    prisma.questionTask.create({
      data: {
        fromId: newTask.fromId, 
        toId: newTask.toId, 
        questionId: twoRandomQuestion[firstRandom].id
      },
    }),
    prisma.questionTask.create({
      data: {
        fromId: newTask.fromId, 
        toId: newTask.toId, 
        questionId: twoRandomQuestion[secondRandom].id
      },
    })
  ]);

  const result = await prisma.networkingTask.findUnique({
    where: {
      fromId_toId: {
        fromId: +userId,
        toId: +targetId,
      },
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
  await prisma.$disconnect();

  return serverResponse({success: true, message: "Berhasil memperoleh pertanyaan networking", data: result, status: 200});
}

interface SubmitNetworkingTaskDTO {
  img_url: string;
  answers: {
    questionId: number;
    answer: string;
  }[],
  secondary_answers: {
    question: string,
    answer: string
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = req.headers.get("X-User-Id");
  const targetId = params.id;

  if (!userId || !targetId) {
    return InvalidHeadersResponse;
  }

  const body = (await req.json()) as SubmitNetworkingTaskDTO;

  if (!body.img_url || !body.answers || !body.secondary_answers) {
    return serverResponse({success: false, message: "Request body tidak lengkap" ,error: "Pastikan img_url, answers dan secondary_answers tidak kosong", status: 400});
  }

  await prisma.$connect();

  const networking_tasks = await prisma.networkingTask.findFirst(
    {
      where: {
        fromId: +userId,
        toId: +targetId
      }, 
      select: {
        questions: true,
        is_done: true
      }
    }
  )

  const questions = networking_tasks?.questions;
  
  if (!questions) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Operasi gagal" ,error: "User belum melakukan networking dengan target user", status: 400});
  }

  if(networking_tasks.is_done) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Operasi gagal" ,error: "User sudah selesai networking dengan target user", status: 400});
  }

  if (questions.length !== body.answers.length) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Request body tidak valid" ,error: "Banyak question tidak sama dengan template yang disediakan", status: 400});
  }

  if (
    body.answers.some(
      ({ questionId }) =>
        !questions.map((q) => q.questionId).includes(questionId)
    )
  ) {
    await prisma.$disconnect();
    return serverResponse({success: false, message: "Request body tidak valid" ,error: "Id question tidak sama dengan template yang disediakan", status: 400});
  }

  await prisma.$transaction(
    body.answers.map(({ questionId, answer }) =>
      prisma.questionTask.update({
        where: {
          questionId_fromId_toId: {
            questionId,
            fromId: +userId,
            toId: +targetId,
          },
        },
        data: {
          answer,
        },
      })
    )
  );

  const user_question = await prisma.question.create({
    data: {
      question: body.secondary_answers.question,
      group_id: -1
    }
  })

  await prisma.questionTask.create({
    data: {
      fromId: +userId,
      toId: +targetId,
      questionId: user_question.id,
      answer: body.secondary_answers.answer,
    }
  });

  const res = await prisma.networkingTask.update({
    where: {
      fromId_toId: {
        fromId: +userId,
        toId: +targetId,
      },
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
      fromId: +userId,
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
    data: res,
    status: 200
  });
}
