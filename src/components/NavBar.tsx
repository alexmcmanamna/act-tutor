import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { StartOverButton } from "./StartOverButton";
import { PlanCalendarChip, type CalendarPlanItem } from "./PlanCalendarChip";
import { Logo } from "./Logo";

export async function NavBar() {
  const studentId = await getStudentIdFromCookies();
  const student = studentId ? await prisma.student.findUnique({ where: { id: studentId } }) : null;

  let calendarItems: CalendarPlanItem[] = [];
  let latestDiagnosticComposite: number | null = null;

  if (student?.onboardingComplete) {
    const [plan, latestDiagnostic] = await Promise.all([
      prisma.studyPlan.findFirst({
        where: { studentId: student.id },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.testAttempt.findFirst({
        where: { studentId: student.id, kind: { in: ["DIAGNOSTIC", "RECALIBRATION"] } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    calendarItems =
      plan?.items.map((i) => ({
        id: i.id,
        type: i.type,
        section: i.section,
        subtopic: i.subtopic,
        title: i.title,
        status: i.status,
        scheduledFor: i.scheduledFor,
        href: i.type === "LESSON" ? `/lesson/${i.section}/${i.subtopic}` : `/practice/${i.section}/${i.subtopic}`,
      })) ?? [];

    latestDiagnosticComposite = latestDiagnostic?.composite ?? student.currentScore ?? null;
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            MK
          </span>
          <span>
            ACT Tutor <span className="font-normal text-slate-400">· with Mr. Kim</span>
          </span>
        </Link>

        {student?.onboardingComplete && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/diagnostic"
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                student.diagnosticCompleted
                  ? "border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                  : "border-amber-400 bg-amber-50 text-amber-700"
              }`}
            >
              🎯 Diagnostic: {student.diagnosticCompleted ? (latestDiagnosticComposite ?? "—") : "Start now"}
            </Link>
            <Link
              href="/full-test"
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
            >
              📝 Full-Length Test
            </Link>
            <PlanCalendarChip items={calendarItems} />
          </div>
        )}

        {student?.onboardingComplete && (
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <Link href="/progress" className="hover:text-indigo-600">
              Progress
            </Link>
            <Link href="/history" className="hover:text-indigo-600">
              History
            </Link>
            <Link href="/mr-kim" className="hover:text-indigo-600">
              Ask Mr. Kim
            </Link>
            <Link href="/settings" className="hover:text-indigo-600">
              Settings
            </Link>
            <StartOverButton />
          </nav>
        )}

        <Logo className="h-8 w-8 flex-shrink-0" />
      </div>
    </header>
  );
}
