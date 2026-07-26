"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CountUpNumber } from "@/components/CountUpNumber";
import { sectionLabel, type SectionKey } from "@/data/subtopics";

interface RevealData {
  composite: number | null;
  sectionScores: Record<string, number | null>;
}

function readStoredResult(): RevealData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("onboarding-diagnostic-result");
  return raw ? (JSON.parse(raw) as RevealData) : null;
}

export default function OnboardingRevealPage() {
  const router = useRouter();
  const [data] = useState<RevealData | null>(readStoredResult);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!data) {
      router.replace("/onboarding/tour");
      return;
    }
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, [data, router]);

  if (!data) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-500">Diagnostic complete</p>
      <h1 className="mb-8 text-2xl font-bold text-slate-900">Here&apos;s your estimated baseline</h1>

      <div className={`transition-opacity duration-700 ${show ? "opacity-100" : "opacity-0"}`}>
        <div className="mb-1 text-7xl font-black tabular-nums text-indigo-600">
          <CountUpNumber value={data.composite} />
        </div>
        <p className="mb-8 text-sm text-slate-500">estimated composite (not an official ACT score)</p>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(data.sectionScores).map(([section, score]) => (
            <div key={section} className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">{sectionLabel(section as SectionKey)}</div>
              <div className="text-2xl font-bold text-slate-900">
                <CountUpNumber value={score} durationMs={1200} />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/onboarding/tour")}
          className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
