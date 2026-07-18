"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClientQuestion } from "@/types";
import { QuestionCard } from "./QuestionCard";
import { MrKimInlineHelp } from "./MrKimInlineHelp";

interface Feedback {
  correctIndex: number;
  explanation: string;
  correct: boolean;
}

interface PracticeSessionProps {
  section: string;
  subtopic: string;
  planItemId: string | null;
}

/** Owns a remount key so "practice again" resets all state by remounting the inner session, rather than manually resetting each state variable inside an effect. */
export function PracticeSession({ section, subtopic, planItemId }: PracticeSessionProps) {
  const [attempt, setAttempt] = useState(0);

  return (
    <PracticeSessionInner
      key={`${section}-${subtopic}-${attempt}`}
      section={section}
      subtopic={subtopic}
      planItemId={planItemId}
      onRestart={() => setAttempt((a) => a + 1)}
    />
  );
}

function PracticeSessionInner({
  section,
  subtopic,
  planItemId,
  onRestart,
}: PracticeSessionProps & { onRestart: () => void }) {
  const [questions, setQuestions] = useState<ClientQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/practice/questions?section=${section}&subtopic=${subtopic}&limit=5`)
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions));
  }, [section, subtopic]);

  if (!questions) return <p className="text-slate-500">Loading practice questions…</p>;
  if (questions.length === 0) return <p className="text-slate-500">No practice questions available for this topic yet.</p>;

  if (finished) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Set complete!</h2>
        <p className="mt-2 text-slate-600">
          You got <span className="font-semibold text-indigo-600">{correctCount}</span> of {questions.length} correct.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={onRestart} className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600">
            Practice again
          </button>
          <Link href="/dashboard" className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const current = questions[index];

  async function handleSelect(i: number) {
    setSelectedIndex(i);
    setSubmitting(true);
    try {
      const res = await fetch("/api/practice/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: current.id, selectedIndex: i }),
      });
      const data = await res.json();
      setFeedback({ correctIndex: data.correctIndex, explanation: data.explanation, correct: data.correct });
      if (data.correct) setCorrectCount((c) => c + 1);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (index + 1 < questions!.length) {
      setIndex(index + 1);
      setFeedback(null);
      setSelectedIndex(null);
    } else {
      if (planItemId) {
        await fetch("/api/plan/item", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: planItemId, status: "DONE" }),
        });
      }
      setFinished(true);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-between text-sm text-slate-500">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>
          {correctCount} correct so far
        </span>
      </div>

      <QuestionCard
        key={current.id}
        question={current}
        showFeedback
        selectedIndex={selectedIndex}
        feedback={feedback}
        onSelect={handleSelect}
        disabled={submitting}
      />

      {feedback && !feedback.correct && (
        <div className="mt-3">
          <MrKimInlineHelp
            initialPrompt={`I got this question wrong: "${current.prompt}" I chose "${current.choices[selectedIndex ?? 0]}" but the correct answer was "${current.choices[feedback.correctIndex]}". Can you explain why in a different way than the standard explanation?`}
          />
        </div>
      )}

      {feedback && (
        <button
          onClick={handleNext}
          className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          {index + 1 < questions.length ? "Next question" : "Finish set"}
        </button>
      )}
    </div>
  );
}
