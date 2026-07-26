import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import type { TestKind } from "@prisma/client";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { assessmentType, scheduledFor } = (await req.json()) as {
    assessmentType: "FULL_LENGTH" | "RECALIBRATION";
    scheduledFor: string | null; // null/omitted = today, take it now
  };

  await prisma.student.update({
    where: { id: studentId },
    data: {
      roundAssessmentType: assessmentType as TestKind,
      roundAssessmentScheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
