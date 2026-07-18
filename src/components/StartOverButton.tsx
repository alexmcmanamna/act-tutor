"use client";

import { useRouter } from "next/navigation";

export function StartOverButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        if (!confirm("This clears your local profile and progress on this browser. Continue?")) return;
        await fetch("/api/student", { method: "DELETE" });
        router.push("/");
        router.refresh();
      }}
      className="text-slate-400 hover:text-red-600"
    >
      Start over
    </button>
  );
}
