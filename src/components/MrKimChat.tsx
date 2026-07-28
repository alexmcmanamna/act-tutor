"use client";

import { useState } from "react";
import { MrKimAvatar } from "./MrKimAvatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function fetchReply(message: string, history: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  const res = await fetch("/api/mrkim/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.reply;
}

export function MrKimChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm Mr. Kim! Ask me anything about the ACT — a concept you're stuck on, test strategy, or how to tackle a question type.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const reply = await fetchReply(text, history);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong reaching Mr. Kim." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <MrKimAvatar size={28} />
        <p className="text-sm font-semibold text-slate-700">Mr. Kim</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && <MrKimAvatar size={24} />}
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm ${
                m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-end justify-start gap-2">
            <MrKimAvatar size={24} />
            <div className="max-w-[80%] rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-400">Thinking…</div>
          </div>
        )}
      </div>
      <div className="flex gap-2 border-t border-slate-200 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Mr. Kim…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
