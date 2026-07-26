import type { Student } from "@prisma/client";
import type { SubtopicMasteryEntry } from "./studyPlan";
import { weeksUntil } from "./studyPlan";

export type GoalHealth = "on-track" | "tight" | "under-capacity";

export interface GoalRealismResult {
  health: GoalHealth;
  realistic: boolean;
  totalMovement: number;
  developingSkills: number;
  recommendedMinutes: number;
  availableMinutes: number | null;
  capacityRatio: number;
  daysUntilTest: number | null;
}

/**
 * Estimates whether a student's goal score is reachable given their available
 * study time before their test date. This is a rough planning heuristic (the
 * same shape as the reference app's "study-time check"), not a guarantee —
 * base 120 minutes, plus 25 min per composite point of movement needed, plus
 * 15 min per subtopic still below 65% mastery.
 */
export function checkGoalRealism(
  student: Pick<Student, "goalScore" | "currentScore" | "testDate">,
  masteryTable: SubtopicMasteryEntry[],
  studyDaysPerWeek: number,
  minutesPerSession: number
): GoalRealismResult {
  const baseline = student.currentScore ?? 18;
  const totalMovement = Math.max(0, student.goalScore - baseline);
  const developingSkills = masteryTable.filter((m) => m.mastery < 0.65).length;
  const recommendedMinutes = 120 + totalMovement * 25 + developingSkills * 15;

  const weeks = weeksUntil(student.testDate);
  const daysUntilTest = student.testDate
    ? Math.max(1, Math.ceil((student.testDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const availableMinutes = daysUntilTest != null ? (daysUntilTest / 7) * studyDaysPerWeek * minutesPerSession : null;

  const capacityRatio = availableMinutes == null ? 1 : recommendedMinutes === 0 ? 1 : availableMinutes / recommendedMinutes;

  const health: GoalHealth = capacityRatio >= 0.95 ? "on-track" : capacityRatio >= 0.72 ? "tight" : "under-capacity";

  return {
    health,
    realistic: health !== "under-capacity",
    totalMovement,
    developingSkills,
    recommendedMinutes,
    availableMinutes,
    capacityRatio,
    daysUntilTest: daysUntilTest ?? (weeks ? weeks * 7 : null),
  };
}
