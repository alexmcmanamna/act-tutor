"use client";

import { useEffect, useState } from "react";

/**
 * Fetches a Mr. Kim message on mount and renders it once ready.
 *
 * NOTE: this used to stream the response token-by-token via a ReadableStream
 * fetch reader. In this dev environment (Next.js 16.2.10 + Turbopack) that
 * reliably hung forever — verified with curl, a raw Node fetch, and a real
 * browser tab — even though the underlying Ollama call itself streamed fine.
 * Reverted to a plain awaited JSON response, which works reliably; the page
 * itself still renders immediately (this card shows "Thinking…" on its own
 * instead of blocking the whole route).
 */
export function MrKimMessageCard({
  endpoint,
  body,
  className = "whitespace-pre-line text-slate-800",
}: {
  endpoint: string;
  body?: unknown;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bodyKey = JSON.stringify(body ?? {});

  useEffect(() => {
    const controller = new AbortController();

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyKey,
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setText(data.text ?? data.explanation ?? "Let's keep going — you've got this."))
      .catch(() => {
        if (!controller.signal.aborted) setText("Let's keep going — you've got this.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [endpoint, bodyKey]);

  return <p className={className}>{loading ? "Thinking…" : text}</p>;
}
