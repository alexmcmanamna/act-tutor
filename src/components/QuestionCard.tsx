"use client";

import { useEffect, useRef, useState } from "react";
import type { ClientQuestion } from "@/types";
import { playCorrectSound } from "@/lib/sounds";

interface Feedback {
  correctIndex: number;
  explanation: string;
  correct: boolean;
}

interface QuestionCardProps {
  question: ClientQuestion;
  disabled?: boolean;
  showFeedback: boolean;
  /** Diagnostic mode: called immediately with the chosen index, no reveal. */
  onAnswer?: (selectedIndex: number) => void;
  /** Practice mode: called with the chosen index; parent fetches feedback and passes it back via `feedback`. */
  onSelect?: (selectedIndex: number) => void;
  feedback?: Feedback | null;
  selectedIndex?: number | null;
}

export function QuestionCard({
  question,
  disabled,
  showFeedback,
  onAnswer,
  onSelect,
  feedback,
  selectedIndex,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(null);
  const playedForRef = useRef<string | null>(null);

  const effectiveSelected = showFeedback ? selectedIndex ?? null : localSelected;

  useEffect(() => {
    if (showFeedback && feedback?.correct && playedForRef.current !== question.id) {
      playedForRef.current = question.id;
      playCorrectSound();
    }
  }, [showFeedback, feedback, question.id]);

  function handleClick(i: number) {
    if (disabled || effectiveSelected !== null) return;
    if (showFeedback) {
      onSelect?.(i);
    } else {
      setLocalSelected(i);
      onAnswer?.(i);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {question.passage && (
        <div className="mb-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          {question.passage}
        </div>
      )}
      <p className="mb-4 text-lg font-medium text-slate-900">{question.prompt}</p>
      <div className="space-y-2">
        {question.choices.map((choice, i) => {
          let stateClass = "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50";
          if (showFeedback && feedback && effectiveSelected !== null) {
            if (i === feedback.correctIndex) {
              stateClass = "border-green-500 bg-green-50";
            } else if (i === effectiveSelected) {
              stateClass = "border-red-500 bg-red-50";
            } else {
              stateClass = "border-slate-200 opacity-60";
            }
          } else if (effectiveSelected === i) {
            stateClass = "border-indigo-500 bg-indigo-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={disabled || effectiveSelected !== null}
              className={`w-full rounded-lg border px-4 py-2.5 text-left transition-colors ${stateClass}`}
            >
              <span className="mr-2 font-semibold text-slate-400">{String.fromCharCode(65 + i)}.</span>
              {choice}
            </button>
          );
        })}
      </div>

      {showFeedback && feedback && (
        <div className={`mt-4 rounded-lg p-4 text-sm ${feedback.correct ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}>
          <p className="mb-1 font-semibold">{feedback.correct ? "Correct!" : "Not quite."}</p>
          <p>{feedback.explanation}</p>
        </div>
      )}
    </div>
  );
}
