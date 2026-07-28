"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MrKimAvatar } from "./MrKimAvatar";

const STOPS = [
  {
    key: "dashboard",
    icon: "🏠",
    title: "Dashboard",
    body: "Your home base — today's goal, streak, points, and your full study plan.",
  },
  {
    key: "lesson",
    icon: "📚",
    title: "Guided lessons",
    body: "Learn the idea, see a worked Example, get the Rule, then Try it yourself.",
  },
  {
    key: "progress",
    icon: "📈",
    title: "Progress",
    body: "A skill map across all four sections, broken down by question type.",
  },
  {
    key: "history",
    icon: "🕘",
    title: "History",
    body: "Every question you've missed, and why — with Mr. Kim's explanation.",
  },
  {
    key: "mrkim",
    icon: "💬",
    title: "Ask Mr. Kim",
    body: "Stuck on anything? Chat with Mr. Kim any time.",
  },
] as const;

/**
 * A spotlight tour: dims the whole screen and cuts a highlighted hole around
 * the specific mock chip/element being described, instead of just describing
 * it in a plain text card. Runs against a small mock replica of the app
 * chrome (rather than the live NavBar) because onboarding isn't complete yet
 * at this point, so the real nav's authenticated chips aren't rendered.
 */
export function OnboardingTour({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const stop = STOPS[i];
  const last = i === STOPS.length - 1;
  const stageRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Record<string, HTMLElement | null>>({});
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    function measure() {
      const target = targetRefs.current[stop.key];
      const stage = stageRef.current;
      if (!target || !stage) return;
      const t = target.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      setRect({ top: t.top - s.top, left: t.left - s.left, width: t.width, height: t.height });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stop.key]);

  function next() {
    if (last) onDone();
    else setI((n) => n + 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Quick tour</p>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Here&apos;s where everything lives</h1>

      {/* Mock app chrome the spotlight highlights against */}
      <div ref={stageRef} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <MrKimAvatar size={22} />
            ACT Tutor
          </div>
          <div className="flex gap-3 text-xs font-medium text-slate-500">
            <span ref={(el) => { targetRefs.current.dashboard = el; }} className="rounded-full px-2 py-1">
              🏠 Dashboard
            </span>
            <span ref={(el) => { targetRefs.current.progress = el; }} className="rounded-full px-2 py-1">
              📈 Progress
            </span>
            <span ref={(el) => { targetRefs.current.history = el; }} className="rounded-full px-2 py-1">
              🕘 History
            </span>
            <span ref={(el) => { targetRefs.current.mrkim = el; }} className="rounded-full px-2 py-1">
              💬 Ask Mr. Kim
            </span>
          </div>
        </div>
        <div className="space-y-2 p-4 text-left">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-400">Today&apos;s goal</div>
            <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-400">🔥 Streak</div>
            <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-400">⭐ Points</div>
          </div>
          <div
            ref={(el) => { targetRefs.current.lesson = el; }}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
          >
            <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border border-slate-300 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">1. Lesson: Punctuation (English)</p>
              <div className="mt-1 flex gap-1">
                {["Learn", "Example", "Rule", "Try it"].map((s) => (
                  <span key={s} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-500">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spotlight overlay: a huge box-shadow "cuts out" a lit rectangle around the target */}
        {rect && (
          <div
            className="pointer-events-none absolute rounded-xl ring-2 ring-indigo-400 transition-all duration-300"
            style={{
              top: rect.top - 6,
              left: rect.left - 6,
              width: rect.width + 12,
              height: rect.height + 12,
              boxShadow: "0 0 0 2000px rgba(15, 23, 42, 0.65)",
            }}
          />
        )}
      </div>

      <div className="mt-6 flex justify-center gap-1.5">
        {STOPS.map((s, idx) => (
          <div key={s.key} className={`h-1.5 w-8 rounded-full transition-colors ${idx <= i ? "bg-indigo-600" : "bg-slate-200"}`} />
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
        <div className="mb-1 text-3xl">{stop.icon}</div>
        <h2 className="mb-1 text-lg font-bold text-slate-900">{stop.title}</h2>
        <p className="text-sm text-slate-600">{stop.body}</p>
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
