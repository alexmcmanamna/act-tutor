"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS } from "@/data/subtopics";

type Step = 1 | 2 | 3;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goalScore, setGoalScore] = useState<string>("");
  const [hasSubmittedScore, setHasSubmittedScore] = useState<boolean | null>(null);
  const [currentScore, setCurrentScore] = useState<string>("");
  const [sectionScores, setSectionScores] = useState<Record<string, string>>({
    ENGLISH: "",
    MATH: "",
    READING: "",
    SCIENCE: "",
  });
  const [testDate, setTestDate] = useState<string>("");
  const [noTestDateYet, setNoTestDateYet] = useState(false);

  const goalScoreNum = Number(goalScore);
  const currentScoreNum = Number(currentScore);

  const canProceedStep1 = goalScoreNum >= 1 && goalScoreNum <= 36;
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
          goalScore: goalScoreNum,
          testDate: noTestDateYet || !testDate ? null : testDate,
          hasSubmittedScore: !!hasSubmittedScore,
          currentScore: hasSubmittedScore ? currentScoreNum : null,
          englishScore: hasSubmittedScore && sectionScores.ENGLISH ? Number(sectionScores.ENGLISH) : null,
          mathScore: hasSubmittedScore && sectionScores.MATH ? Number(sectionScores.MATH) : null,
          readingScore: hasSubmittedScore && sectionScores.READING ? Number(sectionScores.READING) : null,
          scienceScore: hasSubmittedScore && sectionScores.SCIENCE ? Number(sectionScores.SCIENCE) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }

      const data = await res.json();
      if (data.student.hasSubmittedScore) {
        router.push("/dashboard");
      } else {
        router.push("/diagnostic");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <StepIndicator step={step} />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">1. What&apos;s your goal ACT score?</h2>
          <p className="text-sm text-slate-500">Composite score, 1–36.</p>
          <input
            type="number"
            min={1}
            max={36}
            value={goalScore}
            onChange={(e) => setGoalScore(e.target.value)}
            placeholder="e.g. 30"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-lg focus:border-indigo-500 focus:outline-none"
          />
          <button
            disabled={!canProceedStep1}
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">2. Have you taken the ACT before, or know your current score?</h2>
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
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">3. When are you planning to take the ACT?</h2>
          <input
            type="date"
            value={testDate}
            disabled={noTestDateYet}
            onChange={(e) => setTestDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none disabled:bg-slate-100"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={noTestDateYet}
              onChange={(e) => setNoTestDateYet(e.target.checked)}
            />
            I haven&apos;t decided yet
          </label>

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
              {submitting ? "Building your plan…" : "Finish"}
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
