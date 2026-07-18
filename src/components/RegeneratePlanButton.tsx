"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegeneratePlanButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await fetch("/api/plan", { method: "POST" });
        router.refresh();
        setLoading(false);
      }}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50"
    >
      {loading ? "Regenerating…" : "Regenerate plan"}
    </button>
  );
}
