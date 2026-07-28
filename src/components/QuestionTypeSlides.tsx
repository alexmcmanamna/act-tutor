"use client";

import { useState } from "react";
import Link from "next/link";
import { MrKimAvatar } from "./MrKimAvatar";

export interface QuestionTypeSlide {
  section: string;
  sectionLabel: string;
  subtopicLabel: string;
  passage: string | null;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

/** One slide per ACT question type: a real example question, revealed answer, and Mr. Kim's explanation. Replaces the old flat list. */
export function QuestionTypeSlides({ slides }: { slides: QuestionTypeSlide[] }) {
  const [i, setI] = useState(0);
  const slide = slides[i];
  const last = i === slides.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Question type {i + 1} of {slides.length}</p>
        <h1 className="text-2xl font-bold text-slate-900">Every question type, with a real example</h1>
      </div>

      <div className="mb-6 flex justify-center gap-1.5">
        {slides.map((_, idx) => (
          <div key={idx} className={`h-1.5 w-6 rounded-full transition-colors ${idx <= i ? "bg-indigo-600" : "bg-slate-200"}`} />
        ))}
      </div>

      <div key={i} className="animate-[slide-in_0.25s_ease-out] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-500">
          {slide.sectionLabel} · {slide.subtopicLabel}
        </p>

        {slide.passage && (
          <div className="mb-4 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {slide.passage}
          </div>
        )}
        <p className="mb-3 font-medium text-slate-900">{slide.prompt}</p>
        <ul className="mb-4 space-y-1.5">
          {slide.choices.map((c, idx) => (
            <li
              key={idx}
              className={`rounded-lg border px-3 py-2 text-sm ${
                idx === slide.correctIndex ? "border-green-500 bg-green-50 font-medium text-green-800" : "border-slate-200 text-slate-600"
              }`}
            >
              <span className="mr-2 font-semibold text-slate-400">{String.fromCharCode(65 + idx)}.</span>
              {c}
              {idx === slide.correctIndex && <span className="ml-2 text-xs">✓ correct</span>}
            </li>
          ))}
        </ul>

        <div className="flex gap-3 rounded-lg bg-indigo-50 p-3">
          <MrKimAvatar size={26} />
          <p className="text-sm text-indigo-900">{slide.explanation}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          className="text-sm font-medium text-slate-400 hover:text-slate-600 disabled:opacity-30"
        >
          ← Back
        </button>
        {last ? (
          <Link href="/onboarding/goal-check" className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700">
            Continue
          </Link>
        ) : (
          <button onClick={() => setI((n) => n + 1)} className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700">
            Next question type →
          </button>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
