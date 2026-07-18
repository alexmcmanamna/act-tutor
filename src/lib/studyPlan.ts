import { prisma } from "./prisma";
import { SECTIONS, SUBTOPICS, sectionLabel, subtopicLabel, type SectionKey } from "@/data/subtopics";
import { STARTING_MASTERY } from "./adaptive";
import { askMrKim, MR_KIM_SYSTEM_PROMPT } from "./ollama";
import type { Student } from "@prisma/client";

export interface SubtopicMasteryEntry {
  section: SectionKey;
  subtopic: string;
  mastery: number;
  attempts: number;
}

/**
 * Builds a full mastery table across every section/subtopic for a student,
 * filling in gaps from a submitted section score (scaled 1-36 -> 0..1) when a
 * subtopic has no direct attempt data yet, or the default starting mastery
 * otherwise.
 */
export async function buildMasteryTable(student: Student): Promise<SubtopicMasteryEntry[]> {
  const masteries = await prisma.mastery.findMany({ where: { studentId: student.id } });
  const masteryMap = new Map(masteries.map((m) => [`${m.section}:${m.subtopic}`, m]));

  const sectionScoreDefault: Record<SectionKey, number | null> = {
    ENGLISH: student.englishScore ?? null,
    MATH: student.mathScore ?? null,
    READING: student.readingScore ?? null,
    SCIENCE: student.scienceScore ?? null,
  };

  const table: SubtopicMasteryEntry[] = [];
  for (const { key: section } of SECTIONS) {
    for (const { key: subtopic } of SUBTOPICS[section]) {
      const existing = masteryMap.get(`${section}:${subtopic}`);
      if (existing) {
        table.push({ section, subtopic, mastery: existing.score, attempts: existing.attempts });
        continue;
      }
      const scoreDefault = sectionScoreDefault[section];
      const derivedMastery = scoreDefault != null ? clamp01(scoreDefault / 36) : STARTING_MASTERY;
      table.push({ section, subtopic, mastery: derivedMastery, attempts: 0 });
    }
  }
  return table;
}

function clamp01(n: number): number {
  return Math.max(0.05, Math.min(0.95, n));
}

export function weeksUntil(testDate: Date | null): number | null {
  if (!testDate) return null;
  const ms = testDate.getTime() - Date.now();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24 * 7)));
}

export async function generateStudyPlan(studentId: string) {
  const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId } });
  const masteryTable = await buildMasteryTable(student);

  // Weakest subtopics first; this ordering drives both plan items and Mr. Kim's summary.
  const ranked = [...masteryTable].sort((a, b) => a.mastery - b.mastery);
  const weakCount = Math.min(8, ranked.length);
  const weakest = ranked.slice(0, weakCount);

  const weeks = weeksUntil(student.testDate);

  const items: {
    order: number;
    type: "LESSON" | "PRACTICE";
    section: SectionKey;
    subtopic: string;
    title: string;
    rationale: string;
  }[] = [];

  let order = 0;
  for (const entry of weakest) {
    const label = subtopicLabel(entry.section, entry.subtopic);
    const pct = Math.round(entry.mastery * 100);
    items.push({
      order: order++,
      type: "LESSON",
      section: entry.section,
      subtopic: entry.subtopic,
      title: `Lesson: ${label} (${sectionLabel(entry.section)})`,
      rationale:
        entry.attempts > 0
          ? `Estimated mastery is ${pct}% based on your diagnostic/practice answers — this is one of your weaker areas.`
          : `No data yet on this subtopic; starting here based on your submitted ${sectionLabel(entry.section)} score.`,
    });
    items.push({
      order: order++,
      type: "PRACTICE",
      section: entry.section,
      subtopic: entry.subtopic,
      title: `Practice set: ${label} (${sectionLabel(entry.section)})`,
      rationale: `Targeted practice to reinforce the ${label} lesson and raise mastery above ${pct}%.`,
    });
  }

  const summary = await generatePlanSummary(student, weakest, weeks);

  const plan = await prisma.studyPlan.create({
    data: {
      studentId: student.id,
      summary,
      weeksUntilTest: weeks,
      items: {
        create: items.map((i) => ({
          order: i.order,
          type: i.type,
          section: i.section,
          subtopic: i.subtopic,
          title: i.title,
          rationale: i.rationale,
        })),
      },
    },
    include: { items: true },
  });

  return plan;
}

async function generatePlanSummary(
  student: Student,
  weakest: SubtopicMasteryEntry[],
  weeks: number | null
): Promise<string> {
  const weakList = weakest
    .slice(0, 5)
    .map((w) => `${subtopicLabel(w.section, w.subtopic)} (${sectionLabel(w.section)})`)
    .join(", ");

  const userPrompt = `A student is preparing for the ACT.
Goal composite score: ${student.goalScore}
Current/baseline composite score: ${student.currentScore ?? "unknown, estimated from diagnostic"}
Test date: ${student.testDate ? student.testDate.toDateString() : "not set"}${weeks ? ` (${weeks} weeks away)` : ""}
Weakest areas identified: ${weakList}

Write a short (3-4 sentence), encouraging study plan overview addressed directly to the student, mentioning their goal score and the top couple of weak areas you'll focus on first. Do not use markdown headers or bullet lists, just plain prose.`;

  const aiResponse = await askMrKim([
    { role: "system", content: MR_KIM_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  if (aiResponse) return aiResponse;

  return `Welcome! Based on your baseline, I've built a plan to help you close the gap to your goal score of ${student.goalScore}${
    weeks ? ` before your test in about ${weeks} week${weeks === 1 ? "" : "s"}` : ""
  }. We'll start with your weakest areas — ${weakList} — pairing a short lesson with targeted practice for each, then keep adapting as you go. (Note: Mr. Kim's AI commentary is using a fallback message right now because the local Ollama server wasn't reachable — your plan itself is still fully personalized to your data.)`;
}
