import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { checkGoalRealism } from "@/lib/goalRealism";
import { buildGoalCheckPrompt } from "@/lib/mrKimMessages";
import { getMrKimReply } from "@/lib/ollama";

export async function POST() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const masteryTable = await buildMasteryTable(student);
  const realism = checkGoalRealism(student, masteryTable, student.studyDaysPerWeek, student.minutesPerSession);
  const { prompt, fallback } = buildGoalCheckPrompt(student, realism);

  const { text, source } = await getMrKimReply(prompt, fallback);
  return NextResponse.json({ text, source });
}
