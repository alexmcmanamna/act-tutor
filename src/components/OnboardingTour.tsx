"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STOPS = [
  {
    icon: "🏠",
    title: "Dashboard",
    body: "Your home base — today's goal, streak, points, and your full study plan, one lesson+practice pair at a time.",
  },
  {
    icon: "📚",
    title: "Guided lessons",
    body: "Each lesson walks you through four steps: Learn the idea, see a worked Example, get the Rule, then Try it yourself.",
  },
  {
    icon: "📈",
    title: "Progress",
    body: "A skill map across all four sections, broken down by question type, so you always know where you stand.",
  },
  {
    icon: "🕘",
    title: "History",
    body: "Every practice session you've completed, every question you've missed, and why — with Mr. Kim's explanation for each.",
  },
  {
    icon: "💬",
    title: "Ask Mr. Kim",
    body: "Stuck on anything? Chat directly with Mr. Kim any time — he knows your goal score and weak areas.",
  },
];

export function OnboardingTour({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const stop = STOPS[i];
  const last = i === STOPS.length - 1;

  function next() {
    if (last) {
      onDone();
    } else {
      setI((n) => n + 1);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 flex justify-center gap-1.5">
        {STOPS.map((_, idx) => (
          <div key={idx} className={`h-1.5 w-8 rounded-full ${idx <= i ? "bg-indigo-600" : "bg-slate-200"}`} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="mb-4 text-5xl">{stop.icon}</div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">{stop.title}</h2>
        <p className="text-slate-600">{stop.body}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/onboarding/skills")}
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          Skip tour
        </button>
        <button onClick={next} className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700">
          {last ? "Continue" : "Next"}
        </button>
      </div>
    </div>
  );
}
