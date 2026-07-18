import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable, weeksUntil } from "@/lib/studyPlan";
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

  const masteryTable = await buildMasteryTable(student);

  const weeksAway = weeksUntil(student.testDate);

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
