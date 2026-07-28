import { prisma } from "./prisma";
import type { Student } from "@prisma/client";
import { SECTIONS, SUBTOPICS } from "@/data/subtopics";
import type { SubtopicMasteryEntry } from "./studyPlan";

const POINTS_CORRECT = 10;
const POINTS_ATTEMPT = 2;

/**
 * Points-to-score conversion: 1,000 points = 1 point of ACT composite
 * improvement. This is the single source of truth for that conversion —
 * both the dashboard's points tile and the Progress page (next to the skill
 * polygons) call `projectedScoreGain` so the two surfaces never show
 * inconsistent numbers for "how much your points suggest you've improved."
 */
export const POINTS_PER_SCORE_POINT = 1000;

export function projectedScoreGain(points: number): number {
  return Math.round((points / POINTS_PER_SCORE_POINT) * 10) / 10;
}

/**
 * Level system (Khan Academy "energy points"-style motivation layer on top
 * of raw points/badges): every 250 points is a level, with a title that
 * escalates as the student climbs. Gives a shorter-horizon milestone than
 * badges to celebrate between them.
 */
const POINTS_PER_LEVEL = 250;
const LEVEL_TITLES = [
  "Newcomer",
  "Studier",
  "Sharp Shooter",
  "Grinder",
  "Strategist",
  "Ace",
  "Scholar",
  "Virtuoso",
  "Prodigy",
  "Legend",
];

export interface LevelInfo {
  level: number;
  title: string;
  pointsIntoLevel: number;
  pointsForNextLevel: number;
  progress: number; // 0..1
}

export function levelForPoints(points: number): LevelInfo {
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const pointsIntoLevel = points % POINTS_PER_LEVEL;
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return {
    level,
    title,
    pointsIntoLevel,
    pointsForNextLevel: POINTS_PER_LEVEL,
    progress: pointsIntoLevel / POINTS_PER_LEVEL,
  };
}

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
  category: "streak" | "points" | "practice" | "mastery" | "improvement" | "consistency";
  earned: boolean;
}

/**
 * Badge catalog (IXL-inspired: a real spread of categories, not just streaks
 * and points). Computed on the fly from data we already track, rather than
 * persisted as separate rows — simpler, and always accurate.
 */
export function computeBadges(
  student: Pick<Student, "points" | "longestStreak" | "currentRound">,
  totalAttempts: number,
  masteryTable: SubtopicMasteryEntry[] = [],
  composites: number[] = []
): Badge[] {
  const anySubtopicMastered = masteryTable.some((m) => m.mastery >= 0.8);
  const sectionAverages = SECTIONS.map(({ key }) => {
    const rows = masteryTable.filter((m) => m.section === key);
    return rows.length ? rows.reduce((sum, r) => sum + r.mastery, 0) / rows.length : 0;
  });
  const wellRounded = sectionAverages.length === SECTIONS.length && sectionAverages.every((a) => a >= 0.5);
  const totalSubtopics = SECTIONS.reduce((n, { key }) => n + SUBTOPICS[key].length, 0);
  const everyTopicStarted = masteryTable.filter((m) => m.attempts > 0).length >= totalSubtopics;
  const scoreImproved = composites.length >= 2 && composites[composites.length - 1] > composites[0];

  return [
    { key: "first-steps", label: "First Steps", description: "Answered your first question.", category: "practice", earned: totalAttempts >= 1 },
    { key: "streak-3", label: "3-Day Streak", description: "Practiced 3 days in a row.", category: "streak", earned: student.longestStreak >= 3 },
    { key: "streak-7", label: "Week Warrior", description: "Practiced 7 days in a row.", category: "streak", earned: student.longestStreak >= 7 },
    { key: "streak-30", label: "Consistency Champion", description: "Practiced 30 days in a row.", category: "streak", earned: student.longestStreak >= 30 },
    { key: "points-100", label: "Getting Started", description: "Earned 100 points.", category: "points", earned: student.points >= 100 },
    { key: "points-500", label: "Rising Star", description: "Earned 500 points.", category: "points", earned: student.points >= 500 },
    { key: "points-1500", label: "Mr. Kim's Star Pupil", description: "Earned 1,500 points.", category: "points", earned: student.points >= 1500 },
    { key: "attempts-50", label: "Question Crusher", description: "Answered 50 questions.", category: "practice", earned: totalAttempts >= 50 },
    { key: "attempts-200", label: "Question Master", description: "Answered 200 questions.", category: "practice", earned: totalAttempts >= 200 },
    { key: "topic-master", label: "Topic Master", description: "Reached 80% mastery in a topic.", category: "mastery", earned: anySubtopicMastered },
    {
      key: "well-rounded",
      label: "Well-Rounded Scholar",
      description: "Averaged 50%+ mastery across every section.",
      category: "mastery",
      earned: wellRounded,
    },
    {
      key: "every-topic-started",
      label: "Full Coverage",
      description: "Practiced every question type at least once.",
      category: "mastery",
      earned: everyTopicStarted,
    },
    { key: "score-riser", label: "Score Riser", description: "Improved your composite score between tests.", category: "improvement", earned: scoreImproved },
    { key: "round-finisher", label: "Round Finisher", description: "Completed round 1 of your study plan.", category: "consistency", earned: student.currentRound >= 2 },
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
