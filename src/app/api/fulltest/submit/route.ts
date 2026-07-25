import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { recordAttemptAndUpdateMastery } from "@/lib/adaptive";
import type { Section } from "@prisma/client";

interface SubmitBody {
  answers: { questionId: string; selectedIndex: number }[];
}

/** Rough, linear approximation of an ACT scaled score (1-36) from raw accuracy. Not an official ACT concordance. */
function accuracyToScaledScore(accuracy: number): number {
  return Math.round(Math.max(1, Math.min(36, 1 + accuracy * 35)));
}

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const body = (await req.json()) as SubmitBody;
  if (!Array.isArray(body.answers) || body.answers.length === 0) {
    return NextResponse.json({ error: "answers must be a non-empty array." }, { status: 400 });
  }

  const questionIds = body.answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const sectionCorrect: Record<Section, number> = { ENGLISH: 0, MATH: 0, READING: 0, SCIENCE: 0 };
  const sectionTotal: Record<Section, number> = { ENGLISH: 0, MATH: 0, READING: 0, SCIENCE: 0 };

  for (const answer of body.answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const correct = answer.selectedIndex === question.correctIndex;
    sectionTotal[question.section]++;
    if (correct) sectionCorrect[question.section]++;

    await prisma.questionAttempt.create({
      data: {
        studentId,
        questionId: question.id,
        mode: "FULL_LENGTH",
        section: question.section,
        subtopic: question.subtopic,
        correct,
        selectedIndex: answer.selectedIndex,
      },
    });

    await recordAttemptAndUpdateMastery({
      studentId,
      section: question.section,
      subtopic: question.subtopic,
      difficulty: question.difficulty,
      correct,
    });
  }

  const sectionScores: Record<Section, number | null> = { ENGLISH: null, MATH: null, READING: null, SCIENCE: null };
  for (const section of Object.keys(sectionTotal) as Section[]) {
    if (sectionTotal[section] > 0) {
      sectionScores[section] = accuracyToScaledScore(sectionCorrect[section] / sectionTotal[section]);
    }
  }

  const scoredSections = Object.values(sectionScores).filter((s): s is number => s != null);
  const composite = scoredSections.length
    ? Math.round(scoredSections.reduce((a, b) => a + b, 0) / scoredSections.length)
    : null;

  await prisma.testAttempt.create({
    data: {
      studentId,
      kind: "FULL_LENGTH",
      composite,
      englishScore: sectionScores.ENGLISH,
      mathScore: sectionScores.MATH,
      readingScore: sectionScores.READING,
      scienceScore: sectionScores.SCIENCE,
    },
  });

  return NextResponse.json({ sectionScores, composite });
}
