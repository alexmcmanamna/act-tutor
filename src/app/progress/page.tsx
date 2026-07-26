import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { SECTIONS, SUBTOPICS, sectionLabel, subtopicLabel } from "@/data/subtopics";
import { SkillRadar } from "@/components/SkillRadar";

const SECTION_COLORS: Record<string, string> = {
  ENGLISH: "#4f46e5",
  MATH: "#0891b2",
  READING: "#c026d3",
  SCIENCE: "#16a34a",
};

export default async function ProgressPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || !student.onboardingComplete) redirect("/");

  const [masteryTable, recentAttempts] = await Promise.all([
    buildMasteryTable(student),
    prisma.questionAttempt.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { question: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Your progress</p>
        <h1 className="text-2xl font-bold text-slate-900">See how your skills are developing.</h1>
        <p className="mt-2 text-sm text-slate-500">
          Study estimates built from your diagnostic and practice answers — not official ACT scores.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {SECTIONS.map(({ key, label }) => {
          const entries = SUBTOPICS[key].map((s) => {
            const m = masteryTable.find((row) => row.section === key && row.subtopic === s.key);
            return { key: s.key, label: s.label, mastery: m?.mastery ?? 0.3, attempts: m?.attempts ?? 0 };
          });
          return <SkillRadar key={key} title={label} entries={entries} accentColor={SECTION_COLORS[key]} />;
        })}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent scored answers</h2>
        {recentAttempts.length === 0 ? (
          <p className="text-slate-500">No answers yet — once you start practicing, they&apos;ll show up here.</p>
        ) : (
          <ul className="space-y-2">
            {recentAttempts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-xs font-bold ${
                      a.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.correct ? "✓" : "✕"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {subtopicLabel(a.section, a.subtopic)} · {sectionLabel(a.section)}
                    </p>
                    <p className="text-xs text-slate-400">{a.mode.toLowerCase()}</p>
                  </div>
                </div>
                <span className="flex-shrink-0 text-xs text-slate-400">
                  {a.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Mastery percentages come from a difficulty-weighted moving average of your answers, not a certified ACT
        scoring model. Use them to guide where to study, not as a guarantee of your real test score.
      </p>
    </div>
  );
}
