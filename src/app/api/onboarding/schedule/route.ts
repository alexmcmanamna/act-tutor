import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { generateFoundationPlan } from "@/lib/studyPlan";

interface ScheduleBody {
  testDate?: string | null;
  studyDaysPerWeek?: number;
  minutesPerSession?: number;
}

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const body = (await req.json()) as ScheduleBody;

  await prisma.student.update({
    where: { id: studentId },
    data: {
      ...(body.testDate !== undefined ? { testDate: body.testDate ? new Date(body.testDate) : null } : {}),
      ...(body.studyDaysPerWeek ? { studyDaysPerWeek: Math.max(1, Math.min(7, body.studyDaysPerWeek)) } : {}),
      ...(body.minutesPerSession ? { minutesPerSession: Math.max(5, body.minutesPerSession) } : {}),
    },
  });

  // Round 1 is still active during onboarding's goal-check step — reschedule
  // the fixed foundational plan to the new pace/date rather than regenerating
  // its content.
  const plan = await generateFoundationPlan(studentId);

  return NextResponse.json({ ok: true, plan });
}
