import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setStudentIdCookie } from "@/lib/session";
import type { Section } from "@prisma/client";

interface OnboardingBody {
  goalScore: number;
  testDate: string | null;
  hasSubmittedScore: boolean;
  currentScore?: number | null;
  englishScore?: number | null;
  mathScore?: number | null;
  readingScore?: number | null;
  scienceScore?: number | null;
  studyDaysPerWeek?: number;
  minutesPerSession?: number;
  preferredSection?: Section | null;
}

function validScore(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 36;
}

export async function POST(req: Request) {
  const body = (await req.json()) as OnboardingBody;

  if (!validScore(body.goalScore)) {
    return NextResponse.json({ error: "goalScore must be a number between 1 and 36." }, { status: 400 });
  }
  if (body.hasSubmittedScore && !validScore(body.currentScore)) {
    return NextResponse.json(
      { error: "currentScore must be a number between 1 and 36 when hasSubmittedScore is true." },
      { status: 400 }
    );
  }

  const student = await prisma.student.create({
    data: {
      goalScore: body.goalScore,
      testDate: body.testDate ? new Date(body.testDate) : null,
      hasSubmittedScore: !!body.hasSubmittedScore,
      currentScore: body.hasSubmittedScore ? body.currentScore : null,
      englishScore: body.hasSubmittedScore ? body.englishScore ?? null : null,
      mathScore: body.hasSubmittedScore ? body.mathScore ?? null : null,
      readingScore: body.hasSubmittedScore ? body.readingScore ?? null : null,
      scienceScore: body.hasSubmittedScore ? body.scienceScore ?? null : null,
      studyDaysPerWeek: body.studyDaysPerWeek && body.studyDaysPerWeek >= 1 && body.studyDaysPerWeek <= 7 ? body.studyDaysPerWeek : 5,
      minutesPerSession: body.minutesPerSession && body.minutesPerSession >= 5 ? body.minutesPerSession : 30,
      preferredSection: body.preferredSection ?? null,
      // The diagnostic is mandatory for every new user, even when a prior
      // score was submitted — submitted scores only calibrate difficulty
      // (see buildMasteryTable) and are not a substitute for the diagnostic.
      diagnosticCompleted: false,
      onboardingComplete: false,
    },
  });

  await setStudentIdCookie(student.id);

  return NextResponse.json({ student });
}
