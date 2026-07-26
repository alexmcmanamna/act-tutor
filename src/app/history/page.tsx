import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { sectionLabel } from "@/data/subtopics";
import { WrongAnswerRow } from "@/components/WrongAnswerRow";

const MODE_LABEL: Record<string, string> = {
  DIAGNOSTIC: "Diagnostic",
  PRACTICE: "Practice session",
  RECALIBRATION: "Progress check",
  FULL_LENGTH: "Full-length test",
};

export default async function HistoryPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || !student.onboardingComplete) redirect("/");

  const attempts = await prisma.questionAttempt.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { question: true },
  });

  const sessionOrder: string[] = [];
  const sessions = new Map<
    string,
    {
      sessionId: string;
      mode: string;
      createdAt: Date;
      sections: Set<string>;
      correct: number;
      total: number;
      wrong: { attemptId: string; prompt: string; choices: string[]; correctIndex: number; selectedIndex: number }[];
    }
  >();

  for (const a of attempts) {
    if (!sessions.has(a.sessionId)) {
      sessions.set(a.sessionId, {
        sessionId: a.sessionId,
        mode: a.mode,
        createdAt: a.createdAt,
        sections: new Set(),
        correct: 0,
        total: 0,
        wrong: [],
      });
      sessionOrder.push(a.sessionId);
    }
    const s = sessions.get(a.sessionId)!;
    s.sections.add(sectionLabel(a.section));
    s.total++;
    if (a.correct) s.correct++;
    else {
      s.wrong.push({
        attemptId: a.id,
        prompt: a.question.prompt,
        choices: JSON.parse(a.question.choicesJson) as string[],
        correctIndex: a.question.correctIndex,
        selectedIndex: a.selectedIndex,
      });
    }
    if (a.createdAt < s.createdAt) s.createdAt = a.createdAt;
  }

  const orderedSessions = sessionOrder.map((id) => sessions.get(id)!);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-slate-600">Every completed session, and Mr. Kim&apos;s take on what went wrong.</p>
      </div>

      {orderedSessions.length === 0 && <p className="text-slate-500">No sessions yet — get started from your dashboard.</p>}

      <div className="space-y-3">
        {orderedSessions.map((s) => (
          <details key={s.sessionId} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {MODE_LABEL[s.mode] ?? s.mode} · {[...s.sections].join(", ")}
                </p>
                <p className="text-xs text-slate-400">
                  {s.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">
                  {s.correct}/{s.total} correct
                </span>
                <span className="text-slate-400 transition-transform group-open:rotate-180">▾</span>
              </div>
            </summary>

            {s.wrong.length === 0 ? (
              <p className="mt-3 text-sm text-green-700">Perfect session — no wrong answers.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {s.wrong.map((w) => (
                  <WrongAnswerRow key={w.attemptId} data={w} />
                ))}
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
