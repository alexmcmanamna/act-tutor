"use client";

import { useState } from "react";
import { MrKimAvatar } from "./MrKimAvatar";

export interface WrongAnswerData {
  attemptId: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  selectedIndex: number;
}

export function WrongAnswerRow({ data }: { data: WrongAnswerData }) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function explain() {
    setLoading(true);
    try {
      const res = await fetch("/api/history/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: data.attemptId }),
      });
      const json = await res.json();
      setExplanation(json.explanation);
    } catch {
      setExplanation("Sorry, something went wrong reaching Mr. Kim.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-red-100 bg-red-50/40 p-3">
      <p className="mb-1.5 text-sm font-medium text-slate-800">{data.prompt}</p>
      <p className="text-xs text-slate-600">
        You chose <span className="font-semibold text-red-700">{String.fromCharCode(65 + data.selectedIndex)}) {data.choices[data.selectedIndex]}</span>
        {" — "}correct was{" "}
        <span className="font-semibold text-green-700">
          {String.fromCharCode(65 + data.correctIndex)}) {data.choices[data.correctIndex]}
        </span>
      </p>

      {explanation ? (
        <div className="mt-2 flex gap-2 rounded-lg bg-white p-2.5 text-xs text-slate-700">
          <MrKimAvatar size={22} />
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim explains</p>
            <p className="whitespace-pre-line">{explanation}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={explain}
          disabled={loading}
          className="mt-2 rounded-lg border border-dashed border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
        >
          {loading ? "Mr. Kim is thinking…" : "💬 Why was this wrong?"}
        </button>
      )}
    </div>
  );
}
