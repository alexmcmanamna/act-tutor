import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { SECTIONS } from "@/data/subtopics";

// Cap per section so the test stays a reasonable length given the size of
// the local question bank; still covers every section end to end.
const PER_SECTION_CAP = 15;

export async function GET() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const chosen: Awaited<ReturnType<typeof prisma.question.findMany>> = [];
  for (const { key: section } of SECTIONS) {
    const pool = await prisma.question.findMany({ where: { section } });
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    chosen.push(...shuffled.slice(0, PER_SECTION_CAP));
  }

  const sanitized = chosen.map((q) => ({
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
