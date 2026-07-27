"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GoalRealismResult } from "@/lib/goalRealism";
import { MrKimMessageCard } from "./MrKimMessageCard";

export function GoalCheckClient({
  realism,
  initialTestDate,
  initialStudyDaysPerWeek,
  initialMinutesPerSession,
}: {
  realism: GoalRealismResult;
  initialTestDate: string | null;
  initialStudyDaysPerWeek: number;
  initialMinutesPerSession: number;
}) {
  const router = useRouter();
  const [adjusting, setAdjusting] = useState(false);
  const [testDate, setTestDate] = useState(initialTestDate ?? "");
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState(initialStudyDaysPerWeek);
  const [minutesPerSession, setMinutesPerSession] = useState(initialMinutesPerSession);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);

  async function saveAdjustments() {
    setSaving(true);
    await fetch("/api/onboarding/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testDate: testDate || null, studyDaysPerWeek, minutesPerSession }),
    });
    router.refresh();
    setAdjusting(false);
    setSaving(false);
  }

  async function finish(acknowledgeUnrealisticGoal: boolean) {
    setFinishing(true);
    await fetch("/api/onboarding/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acknowledgeUnrealisticGoal }),
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Goal check</p>
        <h1 className="text-2xl font-bold text-slate-900">
          {realism.health === "under-capacity" ? "Let's talk about your timeline" : "Your plan looks good"}
        </h1>
      </div>

      <div
        className={`mb-6 rounded-2xl border p-6 text-left ${
          realism.health === "under-capacity" ? "border-amber-200 bg-amber-50" : "border-indigo-100 bg-indigo-50"
        }`}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Mr. Kim says</p>
        <MrKimMessageCard endpoint="/api/mrkim/goal-check-message" />
      </div>

      {!adjusting && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {realism.health === "under-capacity" && (
            <button
              onClick={() => setAdjusting(true)}
              className="rounded-lg border-2 border-indigo-600 bg-white px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Adjust my schedule
            </button>
          )}
          <button
            disabled={finishing}
            onClick={() => finish(realism.health === "under-capacity")}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {finishing ? "Building your plan…" : realism.health === "under-capacity" ? "Continue anyway" : "Continue to dashboard"}
          </button>
        </div>
      )}

      {adjusting && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Test date</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">Study days per week</label>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStudyDaysPerWeek(n)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    studyDaysPerWeek === n ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 text-slate-600"
                  }`}
                >
                  {n}/wk
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">Minutes per session</label>
            <div className="flex flex-wrap gap-2">
              {[15, 30, 45, 60, 90].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinutesPerSession(n)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    minutesPerSession === n ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 text-slate-600"
                  }`}
                >
                  {n} min
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setAdjusting(false)}
              className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={saveAdjustments}
              className="flex-1 rounded-lg bg-indigo-600 py-2.5 font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & re-check"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
