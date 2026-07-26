import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { askMrKim, MR_KIM_SYSTEM_PROMPT } from "@/lib/ollama";
import { buildMasteryTable } from "@/lib/studyPlan";
import { sectionLabel, subtopicLabel, type SectionKey } from "@/data/subtopics";

const STAGE_PROMPTS: Record<string, string> = {
  learn: "Write a 2-3 sentence encouraging note introducing this concept, framed around why it matters for the ACT.",
  example: "Write a 1-2 sentence note pointing out the key thing to notice in the worked example you're about to see.",
  rule: "Write a 1-2 sentence note encouraging the student to memorize this step-by-step rule for test day.",
  "try-it": "Write a 2-3 sentence encouraging, personalized pep talk before the student starts practice questions on this topic, referencing their current mastery level if it's informative.",
};

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const { section, subtopic, stage } = (await req.json()) as { section: SectionKey; subtopic: string; stage: string };
  const stagePrompt = STAGE_PROMPTS[stage] ?? STAGE_PROMPTS.learn;

  const masteryTable = await buildMasteryTable(student);
  const entry = masteryTable.find((m) => m.section === section && m.subtopic === subtopic);
  const masteryPct = entry ? Math.round(entry.mastery * 100) : null;

  const prompt = `A student is working through a guided lesson on "${subtopicLabel(section, subtopic)}" (${sectionLabel(
    section
  )}) on the "${stage}" step. Their estimated mastery on this topic is ${masteryPct != null ? `${masteryPct}%` : "not yet known"}, their goal composite score is ${student.goalScore}. ${stagePrompt} Do not use markdown, speak directly to the student, keep it brief.`;

  const reply = await askMrKim(
    [
      { role: "system", content: MR_KIM_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    { maxTokens: 400, signal: req.signal }
  );

  const fallbacks: Record<string, string> = {
    learn: `Let's break down ${subtopicLabel(section, subtopic)} — this shows up often on the ACT, so getting the core idea down now will pay off.`,
    example: `Watch how each step below leads to the answer — that's the pattern you'll reuse.`,
    rule: `Memorize this sequence — it'll turn this question type into something fast and mechanical instead of a guessing game.`,
    "try-it": `You've got the idea — let's put it into practice with a few questions.`,
  };

  return NextResponse.json({ text: reply ?? fallbacks[stage] ?? fallbacks.learn, source: reply ? "ollama" : "fallback" });
}
