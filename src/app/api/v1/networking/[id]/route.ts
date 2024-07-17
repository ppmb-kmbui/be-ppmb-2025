import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const targetId = params.id;
  if (!targetId) {
    return new Response("Bad Request", { status: 400 });
  }
  await prisma.$connect();
  const conn = await prisma.networkingTask.findUnique({
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
  if (!conn) {
    await prisma.$disconnect();
    return new Response("Not connected", { status: 404 });
  }
  return new Response(JSON.stringify(conn), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const targetId = params.id;
  if (!targetId) {
    return new Response("Bad Request", { status: 400 });
  }
  await prisma.$connect();
  const conn = await prisma.connection.findFirst({
    where: {
      fromId: +userId,
      toId: +targetId,
    },
  });
  if (!conn) {
    await prisma.$disconnect();
    return new Response("Not connected", { status: 404 });
  }

  const net = await prisma.networkingTask.findUnique({
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
  if (net) {
    await prisma.$disconnect();
    return new Response("Already created", { status: 400 });
  }

  const questionCount = await prisma.question.count({
    where: {
      is_mandatory: false,
    },
  });
  if (questionCount < 2) {
    await prisma.$disconnect();
    return new Response("Not enough questions", { status: 400 });
  }

  const randomNumbers: number[] = [];
  const randomQuestions = await prisma.question.findMany({
    where: {
      is_mandatory: false,
    },
  });
  while (randomNumbers.length < 2) {
    const randomNumber = Math.floor(Math.random() * randomQuestions.length);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }

  const [idx1, idx2] = randomNumbers;
  const q1 = randomQuestions[idx1].id;
  const q2 = randomQuestions[idx2].id;
  const newTask = await prisma.networkingTask.create({
    data: {
      fromId: +userId,
      toId: +targetId,
    },
  });
  await prisma.$transaction([
    prisma.questionTask.create({
      data: {
        fromId: newTask.fromId,
        toId: newTask.toId,
        questionId: q1,
      },
    }),
    prisma.questionTask.create({
      data: {
        fromId: newTask.fromId,
        toId: newTask.toId,
        questionId: q2,
      },
    }),
  ]);
  const mandatoryQuestions = await prisma.question.findMany({
    where: {
      is_mandatory: true,
    },
  });
  await prisma.$transaction(
    mandatoryQuestions.map((q) =>
      prisma.questionTask.create({
        data: {
          fromId: newTask.fromId,
          toId: newTask.toId,
          questionId: q.id,
        },
      })
    )
  );
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

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

interface SubmitNetworkingTaskDTO {
  answers: {
    questionId: number;
    answer: string;
  }[];
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const targetId = params.id;
  if (!targetId) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = (await req.json()) as SubmitNetworkingTaskDTO;

  await prisma.$connect();

  const questions = await prisma.questionTask.findMany({
    where: {
      fromId: +userId,
      toId: +targetId,
    },
  });

  if (questions.length !== body.answers.length) {
    await prisma.$disconnect();
    return new Response("Bad Request", { status: 400 });
  }

  if (
    body.answers.some(
      ({ questionId }) =>
        !questions.map((q) => q.questionId).includes(questionId)
    )
  ) {
    await prisma.$disconnect();
    return new Response("Bad Request", { status: 400 });
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

  const res = await prisma.networkingTask.update({
    where: {
      fromId_toId: {
        fromId: +userId,
        toId: +targetId,
      },
    },
    data: {
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

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
