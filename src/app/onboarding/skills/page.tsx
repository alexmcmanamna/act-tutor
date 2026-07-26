import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { SECTIONS, SUBTOPICS } from "@/data/subtopics";
import { SkillRadar } from "@/components/SkillRadar";

const SECTION_COLORS: Record<string, string> = {
  ENGLISH: "#4f46e5",
  MATH: "#0891b2",
  READING: "#c026d3",
  SCIENCE: "#16a34a",
};

export default async function OnboardingSkillsPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/");

  const masteryTable = await buildMasteryTable(student);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Your skill map</p>
        <h1 className="text-2xl font-bold text-slate-900">Here&apos;s how you did, by question type.</h1>
        <p className="mt-2 text-sm text-slate-500">Study estimates from your diagnostic — not official ACT scores.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {SECTIONS.map(({ key, label }) => {
          const entries = SUBTOPICS[key].map((s) => {
            const m = masteryTable.find((row) => row.section === key && row.subtopic === s.key);
            return { key: s.key, label: s.label, mastery: m?.mastery ?? 0.3, attempts: m?.attempts ?? 0 };
          });
          return (
            <SkillRadar key={key} title={`${label}`} entries={entries} accentColor={SECTION_COLORS[key]} />
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/onboarding/question-types"
          className="inline-block rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
