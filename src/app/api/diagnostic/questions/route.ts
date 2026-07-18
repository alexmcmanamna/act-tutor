import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";

export async function GET() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const questions = await prisma.question.findMany({
    where: { inDiagnostic: true },
    orderBy: [{ section: "asc" }, { subtopic: "asc" }],
  });

  // Strip correctIndex/explanation so the client can't peek at answers before submitting.
  const sanitized = questions.map((q) => ({
    id: q.id,
    section: q.section,
    subtopic: q.subtopic,
    difficulty: q.difficulty,
    passage: q.passage,
    prompt: q.prompt,
    choices: JSON.parse(q.choicesJson) as string[],
  }));

  return NextResponse.json({ questions: sanitized });
}
