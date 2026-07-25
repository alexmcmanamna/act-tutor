import { prisma } from "./prisma";
import type { Student } from "@prisma/client";

const POINTS_CORRECT = 10;
const POINTS_ATTEMPT = 2;

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(earlier: Date, now: Date): boolean {
  const next = new Date(earlier);
  next.setDate(next.getDate() + 1);
  return isSameCalendarDay(next, now);
}

/**
 * Awards points for a single question attempt and updates the daily streak.
 * The streak only advances/resets on the first activity of a given calendar
 * day; subsequent attempts that same day still earn points but don't double
 * count the streak.
 */
export async function recordActivityAndAwardPoints(studentId: string, correct: boolean) {
  const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId } });
  const now = new Date();
  const pointsEarned = correct ? POINTS_CORRECT : POINTS_ATTEMPT;

  let currentStreak = student.currentStreak;
  let longestStreak = student.longestStreak;

  if (!student.lastActivityDate || !isSameCalendarDay(student.lastActivityDate, now)) {
    currentStreak = student.lastActivityDate && isYesterday(student.lastActivityDate, now) ? student.currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { points: { increment: pointsEarned }, currentStreak, longestStreak, lastActivityDate: now },
  });

  return { pointsEarned, currentStreak, longestStreak };
}

export interface Badge {
  key: string;
  label: string;
  description: string;
  earned: boolean;
}

/** Simple threshold-based badges, computed on the fly rather than persisted. */
export function computeBadges(student: Pick<Student, "points" | "longestStreak">, totalAttempts: number): Badge[] {
  return [
    { key: "streak-3", label: "3-Day Streak", description: "Practiced 3 days in a row.", earned: student.longestStreak >= 3 },
    { key: "streak-7", label: "Week Warrior", description: "Practiced 7 days in a row.", earned: student.longestStreak >= 7 },
    { key: "streak-30", label: "Consistency Champion", description: "Practiced 30 days in a row.", earned: student.longestStreak >= 30 },
    { key: "points-100", label: "Getting Started", description: "Earned 100 points.", earned: student.points >= 100 },
    { key: "points-500", label: "Rising Star", description: "Earned 500 points.", earned: student.points >= 500 },
    { key: "points-1500", label: "Mr. Kim's Star Pupil", description: "Earned 1,500 points.", earned: student.points >= 1500 },
    { key: "attempts-50", label: "Question Crusher", description: "Answered 50 questions.", earned: totalAttempts >= 50 },
    { key: "attempts-200", label: "Question Master", description: "Answered 200 questions.", earned: totalAttempts >= 200 },
  ];
}

export interface DailyGoal {
  total: number;
  done: number;
}

/** Today's daily goal: plan items scheduled for today, and how many are already done. */
export async function getDailyGoal(studentId: string): Promise<DailyGoal> {
  const plan = await prisma.studyPlan.findFirst({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  if (!plan) return { total: 0, done: 0 };

  const now = new Date();
  const todayItems = plan.items.filter((i) => i.scheduledFor && isSameCalendarDay(i.scheduledFor, now));
  const done = todayItems.filter((i) => i.status === "DONE").length;
  return { total: todayItems.length, done };
}
