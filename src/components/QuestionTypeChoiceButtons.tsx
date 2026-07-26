"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function QuestionTypeChoiceButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState<"explain" | "skip" | null>(null);

  async function choose(choice: "explain" | "skip") {
    setLoading(choice);
    await fetch("/api/onboarding/question-type-choice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    router.push(choice === "explain" ? "/onboarding/overview" : "/onboarding/goal-check");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <button
        onClick={() => choose("explain")}
        disabled={loading !== null}
        className="rounded-lg border-2 border-indigo-600 bg-white px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
      >
        {loading === "explain" ? "Loading…" : "Explain question types first"}
      </button>
      <button
        onClick={() => choose("skip")}
        disabled={loading !== null}
        className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading === "skip" ? "Loading…" : "Skip straight to lessons"}
      </button>
    </div>
  );
}
