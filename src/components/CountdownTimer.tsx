"use client";

import { useEffect, useRef, useState } from "react";
import { readAccommodations } from "@/lib/accessibility";

/**
 * A countdown timer for timed assessments (progress checks, diagnostics,
 * full-length tests). Calls onExpire once when it reaches zero. Turns amber
 * under 20% of the total time remaining and red under 10%, matching the
 * urgency cues real test-takers get from a proctor's clock.
 *
 * Respects Settings > Accessibility > "Extended time on timed practice"
 * (1.5x allowance) by scaling the budget up right after mount — starts at
 * the plain total (matching SSR) to avoid a hydration mismatch, then
 * adjusts before the first tick if the accommodation is on.
 */
export function CountdownTimer({
  totalSeconds,
  onExpire,
  paused = false,
}: {
  totalSeconds: number;
  onExpire: () => void;
  paused?: boolean;
}) {
  const [effectiveTotal, setEffectiveTotal] = useState(totalSeconds);
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);

  // One-time mount adjustment (not a per-render reset): localStorage isn't
  // readable during SSR, so the accommodation can only be applied after
  // mount. A briefly-wrong initial number is preferable to a hydration
  // mismatch from reading localStorage in a lazy useState initializer.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (readAccommodations().extendedTime) {
      const extended = Math.round(totalSeconds * 1.5);
      setEffectiveTotal(extended);
      setRemaining(extended);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (remaining === 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpire();
    }
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const fraction = effectiveTotal > 0 ? remaining / effectiveTotal : 0;

  const colorClass =
    fraction <= 0.1 ? "border-red-300 bg-red-50 text-red-700" : fraction <= 0.2 ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold tabular-nums ${colorClass}`}
      role="timer"
      aria-live={fraction <= 0.1 ? "assertive" : "off"}
    >
      <span aria-hidden="true">⏱</span>
      {minutes}:{String(seconds).padStart(2, "0")}
    </div>
  );
}

/** ACT-realistic pacing (seconds per question) used to size timers by section. */
export const SECONDS_PER_QUESTION: Record<string, number> = {
  ENGLISH: 36,
  MATH: 60,
  READING: 53,
  SCIENCE: 53,
};

export function timerBudgetSeconds(sections: string[]): number {
  const total = sections.reduce((sum, s) => sum + (SECONDS_PER_QUESTION[s] ?? 50), 0);
  return Math.max(60, total);
}
