import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { recommendedDifficulty } from "@/lib/adaptive";
import type { Section } from "@prisma/client";

export async function GET(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as Section | null;
  const subtopic = searchParams.get("subtopic");
  const limit = Math.min(10, Number(searchParams.get("limit") ?? 5));

  if (!section || !subtopic) {
    return NextResponse.json({ error: "section and subtopic query params are required." }, { status: 400 });
  }

  const mastery = await prisma.mastery.findUnique({
    where: { studentId_section_subtopic: { studentId, section, subtopic } },
  });
  const target = recommendedDifficulty(mastery?.score ?? 0.3);

  const [pool, recentAttempts] = await Promise.all([
    prisma.question.findMany({ where: { section, subtopic } }),
    prisma.questionAttempt.findMany({
      where: { studentId, section, subtopic },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { questionId: true },
    }),
  ]);

  const recentlySeenIds = new Set(recentAttempts.map((a) => a.questionId));

  const ranked = [...pool].sort((a, b) => {
    const aSeen = recentlySeenIds.has(a.id) ? 1 : 0;
    const bSeen = recentlySeenIds.has(b.id) ? 1 : 0;
    if (aSeen !== bSeen) return aSeen - bSeen; // unseen first
    return Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target);
  });

  const chosen = ranked.slice(0, limit);

  return NextResponse.json({
    targetDifficulty: target,
    masteryScore: mastery?.score ?? 0.3,
    questions: chosen.map((q) => ({
      id: q.id,
      section: q.section,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      passage: q.passage,
      prompt: q.prompt,
      choices: JSON.parse(q.choicesJson) as string[],
    })),
  });
}
