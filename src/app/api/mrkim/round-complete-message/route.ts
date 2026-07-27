import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildRoundCompletePrompt } from "@/lib/mrKimMessages";
import { getMrKimReply } from "@/lib/ollama";

export async function POST() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const { prompt, fallback } = buildRoundCompletePrompt(student, student.currentRound);

  const { text, source } = await getMrKimReply(prompt, fallback);
  return NextResponse.json({ text, source });
}
