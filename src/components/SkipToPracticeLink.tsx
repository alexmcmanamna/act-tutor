"use client";

import { useRouter } from "next/navigation";

interface SkipToPracticeLinkProps {
  section: string;
  subtopic: string;
  itemId: string | null;
}

/** The single entry point into practice from a lesson: marks the lesson's plan item done (if any), then navigates. */
export function SkipToPracticeLink({ section, subtopic, itemId }: SkipToPracticeLinkProps) {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        if (itemId) {
          await fetch("/api/plan/item", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId, status: "DONE" }),
          });
        }
        router.push(`/practice/${section}/${subtopic}`);
      }}
      className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
    >
      Skip to practice →
    </button>
  );
}
