"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CountUpNumber } from "@/components/CountUpNumber";

interface FollowUpData {
  previousComposite: number | null;
  newComposite: number | null;
  roundNumber: number;
}

function readStoredFollowUp(): FollowUpData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("round-followup");
  return raw ? (JSON.parse(raw) as FollowUpData) : null;
}

export default function RoundFollowUpPage() {
  const router = useRouter();
  const [data] = useState<FollowUpData | null>(readStoredFollowUp);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      router.replace("/dashboard");
      return;
    }
    fetch("/api/mrkim/round-followup-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((d) => setMessage(d.text));
  }, [data, router]);

  if (!data) return null;

  const improved = data.previousComposite != null && data.newComposite != null && data.newComposite > data.previousComposite;
  const dropped = data.previousComposite != null && data.newComposite != null && data.newComposite < data.previousComposite;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
        Round {data.roundNumber - 1} → Round {data.roundNumber}
      </p>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {improved ? "You improved! 🎉" : dropped ? "Let's keep going" : "Nice consistency"}
      </h1>

      <div className="mb-6 flex items-center justify-center gap-6">
        <div>
          <p className="text-xs text-slate-400">Before</p>
          <p className="text-3xl font-bold text-slate-400">
            <CountUpNumber value={data.previousComposite} durationMs={800} />
          </p>
        </div>
        <span className="text-2xl text-slate-300">→</span>
        <div>
          <p className="text-xs text-slate-400">Now</p>
          <p className={`text-4xl font-black ${improved ? "text-green-600" : dropped ? "text-amber-600" : "text-indigo-600"}`}>
            <CountUpNumber value={data.newComposite} durationMs={1200} />
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-left">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim says</p>
        {message ? (
          <p className="whitespace-pre-line text-slate-800">{message}</p>
        ) : (
          <p className="text-sm text-slate-400">Thinking…</p>
        )}
      </div>

      <button
        onClick={() => {
          sessionStorage.removeItem("round-followup");
          router.push("/dashboard");
          router.refresh();
        }}
        className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
      >
        Continue to round {data.roundNumber}
      </button>
    </div>
  );
}
