"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export function LessonCompleteButton({ itemId }: { itemId: string | null }) {
  const router = useRouter();
  const params = useParams<{ section: string; subtopic: string }>();

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
        router.push(`/practice/${params.section}/${params.subtopic}`);
      }}
      className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
    >
      Got it — start practice
    </button>
  );
}
