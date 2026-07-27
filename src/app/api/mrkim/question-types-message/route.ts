import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { subtopicLabel, sectionLabel } from "@/data/subtopics";
import { buildQuestionTypeChoicePrompt } from "@/lib/mrKimMessages";
import { getMrKimReply } from "@/lib/ollama";

export async function POST() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const masteryTable = await buildMasteryTable(student);
  const weakest = [...masteryTable].sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  const weakLabel = weakest.map((w) => `${subtopicLabel(w.section, w.subtopic)} (${sectionLabel(w.section)})`).join(", ");

  const { prompt, fallback } = buildQuestionTypeChoicePrompt(student, weakLabel);

  const { text, source } = await getMrKimReply(prompt, fallback);
  return NextResponse.json({ text, source });
}
