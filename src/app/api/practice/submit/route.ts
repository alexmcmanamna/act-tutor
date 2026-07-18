import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { recordAttemptAndUpdateMastery } from "@/lib/adaptive";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { questionId, selectedIndex } = (await req.json()) as { questionId: string; selectedIndex: number };

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return NextResponse.json({ error: "Question not found." }, { status: 404 });

  const correct = selectedIndex === question.correctIndex;

  await prisma.questionAttempt.create({
    data: {
      studentId,
      questionId: question.id,
      mode: "PRACTICE",
      section: question.section,
      subtopic: question.subtopic,
      correct,
      selectedIndex,
    },
  });

  const newMastery = await recordAttemptAndUpdateMastery({
    studentId,
    section: question.section,
    subtopic: question.subtopic,
    difficulty: question.difficulty,
    correct,
  });

  return NextResponse.json({
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    newMastery,
  });
}
