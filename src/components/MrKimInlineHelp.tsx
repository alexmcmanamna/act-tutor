"use client";

import { useState } from "react";
import { MrKimAvatar } from "./MrKimAvatar";

export function MrKimInlineHelp({ initialPrompt }: { initialPrompt: string }) {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState("");
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  async function ask(message: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/mrkim/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      setReply(data.reply);
      setHistory((h) => [...h, { role: "user", content: message }, { role: "assistant", content: data.reply }]);
    } catch {
      setReply("Sorry, something went wrong reaching Mr. Kim.");
    } finally {
      setLoading(false);
    }
  }

  if (reply === null && !loading) {
    return (
      <button
        onClick={() => ask(initialPrompt)}
        className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
      >
        💬 Ask Mr. Kim to explain this differently
      </button>
    );
  }

  return (
    <div className="flex gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
      <MrKimAvatar size={28} />
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim</p>
        {loading && !reply && <p className="text-sm text-slate-500">Thinking…</p>}
        {reply && <p className="whitespace-pre-line text-sm text-slate-800">{reply}</p>}
      <div className="mt-3 flex gap-2">
        <input
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && followUp.trim()) {
              ask(followUp.trim());
              setFollowUp("");
            }
          }}
          placeholder="Ask a follow-up…"
          className="flex-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          onClick={() => {
            if (followUp.trim()) {
              ask(followUp.trim());
              setFollowUp("");
            }
          }}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Ask
        </button>
        </div>
      </div>
    </div>
  );
}
