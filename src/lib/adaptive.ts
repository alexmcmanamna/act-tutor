import { prisma } from "./prisma";
import type { Section } from "@prisma/client";

const BASE_LEARNING_RATE = 0.22;
const STARTING_MASTERY = 0.3;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * "Mr. Kim"'s adaptive mastery update.
 *
 * This is a difficulty-weighted moving average (an Elo/IRT-inspired heuristic,
 * not a trained statistical model): getting a hard question right moves mastery
 * up more than getting an easy question right, and missing an easy question
 * moves mastery down more than missing a hard one. Mastery is clamped to [0, 1]
 * and used both to pick the next question's difficulty and to prioritize the
 * study plan.
 */
export function nextMastery(currentMastery: number, difficulty: number, correct: boolean): number {
  const difficultyWeight = difficulty / 3; // difficulty 3 (medium) = neutral weight of 1
  const delta = correct
    ? BASE_LEARNING_RATE * difficultyWeight * (1 - currentMastery)
    : -BASE_LEARNING_RATE * difficultyWeight * currentMastery;
  return clamp(currentMastery + delta, 0.02, 0.98);
}

export async function recordAttemptAndUpdateMastery(params: {
  studentId: string;
  section: Section;
  subtopic: string;
  difficulty: number;
  correct: boolean;
}) {
  const { studentId, section, subtopic, difficulty, correct } = params;

  const existing = await prisma.mastery.findUnique({
    where: { studentId_section_subtopic: { studentId, section, subtopic } },
  });

  const currentMastery = existing?.score ?? STARTING_MASTERY;
  const updated = nextMastery(currentMastery, difficulty, correct);

  await prisma.mastery.upsert({
    where: { studentId_section_subtopic: { studentId, section, subtopic } },
    create: {
      studentId,
      section,
      subtopic,
      score: updated,
      attempts: 1,
    },
    update: {
      score: updated,
      attempts: { increment: 1 },
    },
  });

  return updated;
}

/** Recommend a difficulty (1-5) for the next question in a subtopic, based on current mastery. */
export function recommendedDifficulty(mastery: number): number {
  if (mastery < 0.35) return 1;
  if (mastery < 0.5) return 2;
  if (mastery < 0.65) return 3;
  if (mastery < 0.8) return 4;
  return 5;
}

export async function getMasteryMap(studentId: string) {
  const masteries = await prisma.mastery.findMany({ where: { studentId } });
  const map = new Map<string, { score: number; attempts: number }>();
  for (const m of masteries) {
    map.set(`${m.section}:${m.subtopic}`, { score: m.score, attempts: m.attempts });
  }
  return map;
}

export { STARTING_MASTERY };
