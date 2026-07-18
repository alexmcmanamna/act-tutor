import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { askMrKim, MR_KIM_SYSTEM_PROMPT } from "@/lib/ollama";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { questionId, selectedIndex } = (await req.json()) as { questionId: string; selectedIndex: number };

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return NextResponse.json({ error: "Question not found." }, { status: 404 });

  const choices = JSON.parse(question.choicesJson) as string[];
  const correct = selectedIndex === question.correctIndex;

  const prompt = `A student is working on an ACT ${question.section.toLowerCase()} question about "${question.subtopic}".
${question.passage ? `Passage:\n${question.passage}\n\n` : ""}Question: ${question.prompt}
Choices: ${choices.map((c, i) => `${String.fromCharCode(65 + i)}) ${c}`).join("  ")}
Correct answer: ${String.fromCharCode(65 + question.correctIndex)}) ${choices[question.correctIndex]}
The student chose: ${String.fromCharCode(65 + selectedIndex)}) ${choices[selectedIndex]} (${correct ? "correct" : "incorrect"})

${
  correct
    ? "Briefly (2-3 sentences) confirm why this answer is correct and reinforce the underlying rule so it sticks."
    : "Briefly (3-4 sentences) explain why the correct answer is right, and gently explain the likely misconception behind the student's chosen answer, so they don't repeat it."
}`;

  const reply = await askMrKim([
    { role: "system", content: MR_KIM_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);

  return NextResponse.json({
    explanation: reply ?? question.explanation,
    source: reply ? "ollama" : "fallback",
  });
}
