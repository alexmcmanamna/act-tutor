"use client";

import { useEffect, useState } from "react";
import { MrKimAvatar } from "./MrKimAvatar";

const PLAN_STATUS_MESSAGES = [
  "Mr. Kim is reviewing your diagnostic…",
  "Calculating your score gap…",
  "Identifying your weakest topics…",
  "Weighing English, Math, Reading, and Science…",
  "Building your lesson sequence…",
  "Scheduling your daily practice…",
  "Putting the finishing touches on your plan…",
];

const SCORING_STATUS_MESSAGES = [
  "Mr. Kim is grading your test…",
  "Scoring each section…",
  "Calculating your composite…",
  "Putting the finishing touches on your results…",
];

/** Full-screen overlay with a rotating sequence of short status messages, shown while a study plan is generated or a test is scored. */
export function PlanBuildingOverlay({ active, variant = "plan" }: { active: boolean; variant?: "plan" | "scoring" }) {
  const [index, setIndex] = useState(0);
  const messages = variant === "scoring" ? SCORING_STATUS_MESSAGES : PLAN_STATUS_MESSAGES;

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [active, messages.length]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="relative mb-6 h-16 w-16">
        <MrKimAvatar size={64} />
        <div className="absolute inset-0 -m-1.5 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
      <p key={index} className="animate-[fade-in_0.3s_ease-in-out] text-lg font-medium text-slate-700">
        {messages[index]}
      </p>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
