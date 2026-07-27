import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { getMrKimReply } from "@/lib/ollama";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { attemptId } = (await req.json()) as { attemptId: string };

  const attempt = await prisma.questionAttempt.findUnique({ where: { id: attemptId }, include: { question: true } });
  if (!attempt || attempt.studentId !== studentId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const choices = JSON.parse(attempt.question.choicesJson) as string[];

  const prompt = `A student answered an ACT ${attempt.section.toLowerCase()} question about "${attempt.subtopic}" incorrectly, from their history.
${attempt.question.passage ? `Passage:\n${attempt.question.passage}\n\n` : ""}Question: ${attempt.question.prompt}
Choices: ${choices.map((c, i) => `${String.fromCharCode(65 + i)}) ${c}`).join("  ")}
Correct answer: ${String.fromCharCode(65 + attempt.question.correctIndex)}) ${choices[attempt.question.correctIndex]}
The student chose: ${String.fromCharCode(65 + attempt.selectedIndex)}) ${choices[attempt.selectedIndex]}

Briefly (3-4 sentences) explain why the correct answer is right and what likely led to the student's wrong choice, so they understand the mistake and don't repeat it.`;

  const { text, source } = await getMrKimReply(prompt, attempt.question.explanation, { signal: req.signal });

  return NextResponse.json({ explanation: text, source });
}
