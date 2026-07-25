import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable, weeksUntil } from "@/lib/studyPlan";
import { getDailyGoal, computeBadges } from "@/lib/gamification";
import { MasteryOverview } from "@/components/MasteryOverview";
import { PlanItemList } from "@/components/PlanItemList";
import { RegeneratePlanButton } from "@/components/RegeneratePlanButton";

export default async function DashboardPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || !student.onboardingComplete) redirect("/");

  const plan = await prisma.studyPlan.findFirst({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  const [masteryTable, dailyGoal, totalAttempts] = await Promise.all([
    buildMasteryTable(student),
    getDailyGoal(studentId),
    prisma.questionAttempt.count({ where: { studentId } }),
  ]);

  const weeksAway = weeksUntil(student.testDate);
  const planFullyDone = !!plan && plan.items.length > 0 && plan.items.every((i) => i.status === "DONE");
  const badges = computeBadges(student, totalAttempts).filter((b) => b.earned);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your dashboard</h1>
          <p className="text-slate-600">
            Goal: <span className="font-semibold text-indigo-600">{student.goalScore}</span> · Current:{" "}
            <span className="font-semibold">{student.currentScore ?? "—"}</span>
            {weeksAway && <> · Test in ~{weeksAway} week{weeksAway === 1 ? "" : "s"}</>}
          </p>
        </div>
        <RegeneratePlanButton />
      </div>

      {planFullyDone && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">
          <div>
            <p className="font-semibold text-green-800">You&apos;ve finished every item in your plan! 🎉</p>
            <p className="text-sm text-green-700">Take a half-length progress check to see how far you&apos;ve come and get a fresh plan.</p>
          </div>
          <Link href="/diagnostic?mode=recalibration" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            Take progress check
          </Link>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Today&apos;s goal</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {dailyGoal.done}/{dailyGoal.total || 0}
          </p>
          <p className="text-xs text-slate-500">items done today</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Streak</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            🔥 {student.currentStreak} day{student.currentStreak === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-slate-500">longest: {student.longestStreak}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Points</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">⭐ {student.points}</p>
          <p className="text-xs text-slate-500">
            {badges.length > 0 ? `${badges.length} badge${badges.length === 1 ? "" : "s"} earned` : "answer questions to earn badges"}
          </p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.key}
              title={b.description}
              className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
            >
              🏅 {b.label}
            </span>
          ))}
        </div>
      )}

      {plan && (
        <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim says</p>
          <p className="text-slate-800">{plan.summary}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Mastery by topic</h2>
        <MasteryOverview masteryTable={masteryTable} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Your study plan</h2>
        {plan ? (
          <PlanItemList items={plan.items} />
        ) : (
          <p className="text-slate-500">No plan yet — click &quot;Regenerate plan&quot; above.</p>
        )}
      </div>
    </div>
  );
}
