import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { recordAttemptAndUpdateMastery } from "@/lib/adaptive";
import { generateStudyPlan } from "@/lib/studyPlan";
import type { Section } from "@prisma/client";

interface SubmitBody {
  answers: { questionId: string; selectedIndex: number }[];
}

/** Rough, linear approximation of an ACT scaled score (1-36) from raw accuracy on the diagnostic. Not an official ACT concordance. */
function accuracyToScaledScore(accuracy: number): number {
  return Math.round(Math.max(1, Math.min(36, 1 + accuracy * 35)));
}

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const body = (await req.json()) as SubmitBody;
  if (!Array.isArray(body.answers) || body.answers.length === 0) {
    return NextResponse.json({ error: "answers must be a non-empty array." }, { status: 400 });
  }

  const questionIds = body.answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const sectionCorrect: Record<Section, number> = { ENGLISH: 0, MATH: 0, READING: 0, SCIENCE: 0 };
  const sectionTotal: Record<Section, number> = { ENGLISH: 0, MATH: 0, READING: 0, SCIENCE: 0 };

  const results: { questionId: string; correct: boolean; correctIndex: number; explanation: string }[] = [];

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
        mode: "DIAGNOSTIC",
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

    results.push({
      questionId: question.id,
      correct,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
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

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: {
      diagnosticCompleted: true,
      onboardingComplete: true,
      currentScore: student.hasSubmittedScore ? student.currentScore : composite,
      englishScore: student.hasSubmittedScore ? student.englishScore : sectionScores.ENGLISH,
      mathScore: student.hasSubmittedScore ? student.mathScore : sectionScores.MATH,
      readingScore: student.hasSubmittedScore ? student.readingScore : sectionScores.READING,
      scienceScore: student.hasSubmittedScore ? student.scienceScore : sectionScores.SCIENCE,
    },
  });

  const plan = await generateStudyPlan(studentId);

  return NextResponse.json({ student: updated, plan, results, sectionScores, composite });
}
