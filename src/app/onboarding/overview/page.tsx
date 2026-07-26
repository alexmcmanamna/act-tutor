import { redirect } from "next/navigation";
import Link from "next/link";
import { getStudentIdFromCookies } from "@/lib/session";
import { SECTIONS, SUBTOPICS } from "@/data/subtopics";
import { getLesson } from "@/data/lessons";

export default async function OnboardingOverviewPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Quick overview</p>
        <h1 className="text-2xl font-bold text-slate-900">Every question type, at a glance</h1>
        <p className="mt-2 text-sm text-slate-500">
          You&apos;ll get a full guided lesson on each of these in round 1 — this is just a preview.
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map(({ key, label }) => (
          <div key={key}>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">{label}</h2>
            <ul className="space-y-2">
              {SUBTOPICS[key].map((s) => {
                const lesson = getLesson(key, s.key);
                const firstSentence = lesson?.body.split(/(?<=[.!?])\s/)[0] ?? "";
                return (
                  <li key={s.key} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="font-semibold text-slate-900">{s.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{firstSentence}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/onboarding/goal-check"
          className="inline-block rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
