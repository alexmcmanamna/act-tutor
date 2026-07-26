"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS } from "@/data/subtopics";
import { upcomingActTestDates } from "@/data/actTestDates";

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysAway(d: Date): number {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
}

type Step = 0 | 1 | 2 | 3;

const DAYS_PER_WEEK_OPTIONS = [2, 3, 4, 5, 6, 7];
const MINUTES_OPTIONS = [15, 30, 45, 60];
const PRIORITY_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Balanced across everything" },
  { value: "ENGLISH", label: "English" },
  { value: "MATH", label: "Math" },
  { value: "READING", label: "Reading" },
  { value: "SCIENCE", label: "Science" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goalScore, setGoalScore] = useState<number>(24);
  const [hasSubmittedScore, setHasSubmittedScore] = useState<boolean | null>(null);
  const [currentScore, setCurrentScore] = useState<string>("");
  const [sectionScores, setSectionScores] = useState<Record<string, string>>({
    ENGLISH: "",
    MATH: "",
    READING: "",
    SCIENCE: "",
  });
  const [testDate, setTestDate] = useState<string>("");
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState(5);
  const [minutesPerSession, setMinutesPerSession] = useState(30);
  const [preferredSection, setPreferredSection] = useState<string>("");
  const upcomingTestDates = upcomingActTestDates(3);

  const currentScoreNum = Number(currentScore);
  const canProceedStep2 =
    hasSubmittedScore === false || (hasSubmittedScore === true && currentScoreNum >= 1 && currentScoreNum <= 36);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalScore,
          testDate: testDate || null,
          hasSubmittedScore: !!hasSubmittedScore,
          currentScore: hasSubmittedScore ? currentScoreNum : null,
          englishScore: hasSubmittedScore && sectionScores.ENGLISH ? Number(sectionScores.ENGLISH) : null,
          mathScore: hasSubmittedScore && sectionScores.MATH ? Number(sectionScores.MATH) : null,
          readingScore: hasSubmittedScore && sectionScores.READING ? Number(sectionScores.READING) : null,
          scienceScore: hasSubmittedScore && sectionScores.SCIENCE ? Number(sectionScores.SCIENCE) : null,
          studyDaysPerWeek,
          minutesPerSession,
          preferredSection: preferredSection || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }

      // The diagnostic is mandatory for every new user, regardless of any
      // submitted score — it's only used to calibrate difficulty.
      router.push("/diagnostic");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (step === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
          MK
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Meet Mr. Kim, your study coach
        </p>
        <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900">
          A study plan that changes when your answers do.
        </h1>
        <p className="mx-auto mb-1 max-w-md text-slate-600">
          Three quick questions, a short diagnostic, and Mr. Kim builds a plan around exactly what you need.
        </p>
        <p className="mx-auto mb-6 max-w-md text-xs text-slate-400">
          Skill percentages are study estimates — not official ACT scores.
        </p>
        <button
          onClick={() => setStep(1)}
          className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Set up my plan
        </button>
        <p className="mt-4 text-xs text-slate-400">🔒 No account needed.</p>

        <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {[
            { n: "01", t: "Set your direction", d: "Goal score, schedule, test date." },
            { n: "02", t: "Show what you know", d: "A short diagnostic across every section." },
            { n: "03", t: "Get your next step", d: "A plan that adapts as you practice." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl bg-slate-50 p-4">
              <p className="mb-1 font-mono text-xs font-bold text-indigo-500">{s.n}</p>
              <p className="text-sm font-semibold text-slate-800">{s.t}</p>
              <p className="text-xs text-slate-500">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <StepIndicator step={step} />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">What&apos;s your goal ACT score?</h2>
          <p className="text-sm text-slate-500">Composite score, 1–36.</p>
          <div className="flex items-center justify-center gap-6 py-4">
            <button
              type="button"
              onClick={() => setGoalScore((g) => Math.max(1, g - 1))}
              className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 text-xl font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
              aria-label="Decrease goal score"
            >
              −
            </button>
            <span className="w-24 text-center text-6xl font-black tabular-nums text-indigo-600">{goalScore}</span>
            <button
              type="button"
              onClick={() => setGoalScore((g) => Math.min(36, g + 1))}
              className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 text-xl font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
              aria-label="Increase goal score"
            >
              +
            </button>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Have you taken the ACT before, or know your current score?</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setHasSubmittedScore(true)}
              className={`flex-1 rounded-lg border py-2.5 font-medium ${
                hasSubmittedScore === true
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              Yes, I know my score
            </button>
            <button
              onClick={() => setHasSubmittedScore(false)}
              className={`flex-1 rounded-lg border py-2.5 font-medium ${
                hasSubmittedScore === false
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              No, give me a diagnostic
            </button>
          </div>

          {hasSubmittedScore === true && (
            <div className="space-y-3 rounded-lg bg-slate-50 p-4">
              <label className="block text-sm font-medium text-slate-700">Current composite score</label>
              <input
                type="number"
                min={1}
                max={36}
                value={currentScore}
                onChange={(e) => setCurrentScore(e.target.value)}
                placeholder="e.g. 24"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              />
              <p className="pt-2 text-sm font-medium text-slate-700">Section scores (optional, if you have them)</p>
              <div className="grid grid-cols-2 gap-3">
                {SECTIONS.map((s) => (
                  <div key={s.key}>
                    <label className="mb-1 block text-xs text-slate-500">{s.label}</label>
                    <input
                      type="number"
                      min={1}
                      max={36}
                      value={sectionScores[s.key]}
                      onChange={(e) => setSectionScores((prev) => ({ ...prev, [s.key]: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSubmittedScore === false && (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              No problem — right after this, Mr. Kim will give you a short diagnostic test covering all four
              sections to establish your baseline.
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-600">
              Back
            </button>
            <button
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
              className="flex-1 rounded-lg bg-indigo-600 py-2.5 font-medium text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">Your schedule</h2>

          <div>
            {upcomingTestDates.length > 0 && (
              <div className="mb-2">
                <p className="mb-2 text-xs font-medium text-slate-500">When are you planning to take the ACT?</p>
                <div className="flex flex-wrap gap-2">
                  {upcomingTestDates.map((d) => {
                    const value = toDateInputValue(d);
                    const selected = testDate === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTestDate(value)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                          selected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                        }`}
                      >
                        {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {daysAway(d)}d
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">How many days a week can you study?</p>
            <div className="flex flex-wrap gap-2">
              {DAYS_PER_WEEK_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStudyDaysPerWeek(n)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    studyDaysPerWeek === n
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  {n}/wk
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">About how long per study session?</p>
            <div className="flex flex-wrap gap-2">
              {MINUTES_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinutesPerSession(n)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    minutesPerSession === n
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  {n} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">What should Mr. Kim prioritize?</p>
            <select
              value={preferredSection}
              onChange={(e) => setPreferredSection(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-600">
              Back
            </button>
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 rounded-lg bg-indigo-600 py-2.5 font-medium text-white disabled:opacity-40"
            >
              {submitting ? "Saving…" : "Create my plan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {[1, 2, 3].map((s) => (
        <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-indigo-600" : "bg-slate-200"}`} />
      ))}
    </div>
  );
}
