"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LessonStageContent } from "@/lib/lessonContent";
import { PracticeSession } from "./PracticeSession";
import { MrKimBubble } from "./MrKimBubble";

const STAGES = [
  { key: "learn", label: "Learn" },
  { key: "example", label: "Example" },
  { key: "rule", label: "Rule" },
  { key: "try-it", label: "Try it" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

function CoachBubble({ section, subtopic, stage }: { section: string; subtopic: string; stage: StageKey }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // An AbortController (not just an ignore-the-result flag) so switching
    // stages actually cancels the in-flight request server-side, instead of
    // leaving it to keep running and queueing up behind the single-threaded
    // local Ollama server.
    const controller = new AbortController();
    fetch("/api/mrkim/lesson-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, subtopic, stage }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setText(data.text))
      .catch(() => {
        if (!controller.signal.aborted) setText("Let's keep going — you've got this.");
      });
    return () => {
      controller.abort();
    };
  }, [section, subtopic, stage]);

  return (
    <div className="mt-4">
      <MrKimBubble className="border-indigo-100 bg-indigo-50/60" label="Mr. Kim" text={text ?? undefined}>
        {text ? <p className="text-sm text-slate-800">{text}</p> : <p className="text-sm text-slate-400">Thinking…</p>}
      </MrKimBubble>
    </div>
  );
}

export function LessonWorkspace({ stages, planItemId }: { stages: LessonStageContent; planItemId: string | null }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const stage = STAGES[stageIndex];
  const isLast = stageIndex === STAGES.length - 1;

  if (practiceStarted) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            {stages.sectionLabel} · {stages.subtopicLabel} — practice
          </p>
          <button onClick={() => setPracticeStarted(false)} className="text-xs text-slate-400 hover:text-slate-600">
            ← back to lesson
          </button>
        </div>
        <PracticeSession section={stages.section} subtopic={stages.subtopic} planItemId={planItemId} />
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-indigo-600">
        {stages.sectionLabel} · {stages.subtopicLabel}
      </p>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">{stages.title}</h1>

      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStageIndex(i)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              i === stageIndex ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {stage.key === "learn" && (
          <div className="space-y-3 leading-relaxed text-slate-700">
            {stages.concept.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {stage.key === "example" &&
          (stages.example ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-500">See one worked out:</p>
              {stages.example.passage && (
                <div className="mb-3 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  {stages.example.passage}
                </div>
              )}
              <p className="mb-3 font-medium text-slate-900">{stages.example.prompt}</p>
              <ul className="mb-3 space-y-1.5">
                {stages.example.choices.map((c, i) => (
                  <li
                    key={i}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      i === stages.example!.correctIndex
                        ? "border-green-500 bg-green-50 font-medium text-green-800"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="mr-2 font-semibold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                    {c}
                    {i === stages.example!.correctIndex && <span className="ml-2 text-xs">✓ correct</span>}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                <p className="mb-1 font-semibold">Why:</p>
                <p>{stages.example.explanation}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No worked example available for this topic yet.</p>
          ))}

        {stage.key === "rule" && (
          <ol className="space-y-3">
            {stages.decisionRule.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 font-mono text-sm font-bold text-indigo-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {stage.key === "try-it" && (
          <div>
            <p className="mb-4 text-slate-700">{stages.tryItIntro}</p>
            <a
              href={stages.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-600"
            >
              ▶ Watch related videos on YouTube
            </a>
          </div>
        )}

        <CoachBubble
          key={`${stages.section}-${stages.subtopic}-${stage.key}`}
          section={stages.section}
          subtopic={stages.subtopic}
          stage={stage.key}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setStageIndex((i) => Math.max(0, i - 1))}
          disabled={stageIndex === 0}
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600 disabled:opacity-30"
        >
          Back
        </button>
        {isLast ? (
          <button
            onClick={() => setPracticeStarted(true)}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            Start practice
          </button>
        ) : (
          <button
            onClick={() => setStageIndex((i) => Math.min(STAGES.length - 1, i + 1))}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            Next
          </button>
        )}
      </div>

      <div className="mt-3 text-center">
        <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
