"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RoundCompleteClient({ message, roundNumber }: { message: string; roundNumber: number }) {
  const router = useRouter();
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const isToday = !scheduledFor;

  async function choose(assessmentType: "FULL_LENGTH" | "RECALIBRATION") {
    setLoading(assessmentType);
    await fetch("/api/round/schedule-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentType, scheduledFor: scheduledFor || null }),
    });

    if (isToday) {
      router.push(assessmentType === "FULL_LENGTH" ? "/full-test" : "/diagnostic?mode=recalibration");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Round {roundNumber} complete</p>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Time to check your progress</h1>

      <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-left">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim says</p>
        <p className="whitespace-pre-line text-slate-800">{message}</p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-left">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Take it today, or schedule it for later?
        </label>
        <input
          type="date"
          value={scheduledFor}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setScheduledFor(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">Leave blank to take it right now.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => choose("FULL_LENGTH")}
          disabled={loading !== null}
          className="rounded-lg border-2 border-indigo-600 bg-white px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
        >
          {loading === "FULL_LENGTH" ? "…" : isToday ? "Take a full-length test now" : "Schedule full-length test"}
        </button>
        <button
          onClick={() => choose("RECALIBRATION")}
          disabled={loading !== null}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading === "RECALIBRATION" ? "…" : isToday ? "Take another diagnostic now" : "Schedule diagnostic"}
        </button>
      </div>
    </div>
  );
}
