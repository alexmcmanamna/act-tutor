import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { computeBadges, type Badge } from "@/lib/gamification";
import { NewBadgeCelebration } from "@/components/NewBadgeCelebration";

const CATEGORY_LABELS: Record<Badge["category"], string> = {
  streak: "Streaks",
  points: "Points",
  practice: "Practice volume",
  mastery: "Mastery",
  improvement: "Improvement",
  consistency: "Consistency",
};

const CATEGORY_ORDER: Badge["category"][] = ["streak", "points", "practice", "mastery", "improvement", "consistency"];

export default async function BadgesPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || !student.onboardingComplete) redirect("/");

  const [masteryTable, totalAttempts, testAttempts] = await Promise.all([
    buildMasteryTable(student),
    prisma.questionAttempt.count({ where: { studentId } }),
    prisma.testAttempt.findMany({ where: { studentId }, orderBy: { createdAt: "asc" }, select: { composite: true } }),
  ]);
  const composites = testAttempts.map((t) => t.composite).filter((c): c is number => c != null);

  const badges = computeBadges(student, totalAttempts, masteryTable, composites);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <NewBadgeCelebration earnedKeys={badges.filter((b) => b.earned).map((b) => b.key)} />
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Badges</p>
        <h1 className="text-2xl font-bold text-slate-900">
          {earnedCount} of {badges.length} earned
        </h1>
        <p className="mt-1 text-sm text-slate-500">Keep studying to unlock the rest — Mr. Kim&apos;s watching your progress.</p>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const inCategory = badges.filter((b) => b.category === category);
        if (inCategory.length === 0) return null;
        return (
          <div key={category} className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">{CATEGORY_LABELS[category]}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {inCategory.map((b) => (
                <div
                  key={b.key}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md ${
                    b.earned ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50 opacity-70"
                  }`}
                >
                  <span className="text-2xl">{b.earned ? "🏅" : "🔒"}</span>
                  <div>
                    <p className={`font-semibold ${b.earned ? "text-amber-900" : "text-slate-600"}`}>{b.label}</p>
                    <p className="text-xs text-slate-500">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
