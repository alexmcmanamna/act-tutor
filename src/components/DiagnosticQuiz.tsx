"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientQuestion } from "@/types";
import { sectionLabel, subtopicLabel } from "@/data/subtopics";
import { QuestionCard } from "./QuestionCard";
import { PlanBuildingOverlay } from "./PlanBuildingOverlay";
import { CountdownTimer, timerBudgetSeconds } from "./CountdownTimer";
import { playSetCompleteSound } from "@/lib/sounds";

interface DiagnosticQuizProps {
  /** When set, this is a shorter recalibration diagnostic (after finishing all assigned lessons), not the initial onboarding one. */
  mode?: "initial" | "recalibration";
}

export function DiagnosticQuiz({ mode = "initial" }: DiagnosticQuizProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ClientQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState<{
    composite: number | null;
    sectionScores: Record<string, number | null>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/diagnostic/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions))
      .catch(() => setError("Couldn't load the diagnostic. Try refreshing."));
  }, []);

  useEffect(() => {
    if (done && summary) playSetCompleteSound();
  }, [done, summary]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!questions) return <p className="text-slate-500">Loading your diagnostic…</p>;

  if (done && summary) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          {mode === "recalibration" ? "Progress check complete!" : "Diagnostic complete!"}
        </h2>
        <p className="mt-2 text-slate-600">Here&apos;s your estimated baseline (a rough approximation, not an official score):</p>
        <div className="my-6 text-5xl font-bold text-indigo-600">{summary.composite ?? "—"}</div>
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(summary.sectionScores).map(([section, score]) => (
            <div key={section} className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">{sectionLabel(section as never)}</div>
              <div className="text-xl font-semibold">{score ?? "—"}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white"
        >
          View my study plan
        </button>
      </div>
    );
  }

  if (submitting) return <PlanBuildingOverlay active />;

  const current = questions[index];
  const progress = Math.round((index / questions.length) * 100);

  async function submitAll(finalAnswers: Record<string, number>) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          answers: Object.entries(finalAnswers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex })),
        }),
      });
      const data = await res.json();
      // The student's onboardingComplete/diagnosticCompleted flags just flipped
      // server-side, which changes what the root layout's NavBar renders (the
      // persistent chips). Invalidate the router cache now so subsequent
      // navigation doesn't reuse the stale, pre-diagnostic layout.
      router.refresh();

      if (mode === "initial") {
        // The very first diagnostic feeds the reveal -> tour -> skill polygons
        // -> goal-check onboarding sequence instead of landing on the dashboard.
        sessionStorage.setItem(
          "onboarding-diagnostic-result",
          JSON.stringify({ composite: data.composite, sectionScores: data.sectionScores })
        );
        router.push("/onboarding/reveal");
        return;
      }

      if (data.roundTransition) {
        sessionStorage.setItem(
          "round-followup",
          JSON.stringify({
            previousComposite: data.previousComposite,
            newComposite: data.composite,
            roundNumber: data.roundNumber,
          })
        );
        router.push("/round-followup");
        return;
      }

      setSummary({ composite: data.composite, sectionScores: data.sectionScores });
      setDone(true);
    } catch {
      setError("Couldn't submit your diagnostic. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAnswer(selectedIndex: number) {
    const updated = { ...answers, [current.id]: selectedIndex };
    setAnswers(updated);
    if (index + 1 < questions!.length) {
      setIndex(index + 1);
    } else {
      submitAll(updated);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-sm text-slate-500">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-3">
            <span>
              {sectionLabel(current.section)} · {subtopicLabel(current.section, current.subtopic)}
            </span>
            <CountdownTimer
              totalSeconds={timerBudgetSeconds(questions.map((q) => q.section))}
              onExpire={() => submitAll(answers)}
              paused={submitting}
            />
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <QuestionCard
        key={current.id}
        question={current}
        onAnswer={handleAnswer}
        disabled={submitting}
        showFeedback={false}
      />
    </div>
  );
}
