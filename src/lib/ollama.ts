const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen3:4b";

interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callOllamaOnce(
  messages: OllamaChatMessage[],
  options?: { timeoutMs?: number; maxTokens?: number; signal?: AbortSignal }
): Promise<string | null> {
  const controller = new AbortController();
  // Local CPU inference is slow on this hardware (no GPU, ~3 tokens/sec); give it
  // plenty of room before falling back to static content.
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 170000);
  // If the caller's own request was cancelled (e.g. the user navigated away
  // mid-lesson), abort this call too — otherwise the single-threaded local
  // Ollama server keeps grinding on stale requests, queueing up behind them
  // and starving the next real request for minutes.
  options?.signal?.addEventListener("abort", () => controller.abort());

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        // qwen3 is a hybrid "thinking" model. With think:true its reasoning is
        // returned separately in message.thinking, leaving message.content clean
        // and short — much better instruction-following than think:false, where
        // the reasoning bleeds directly into the visible answer.
        think: true,
        // Must be generous: with think:true, num_predict caps thinking + the final
        // answer combined, and this model's reasoning pass alone can run 150-440+
        // tokens by itself (measured, and varies run to run since temperature > 0).
        // Too low a cap regularly leaves zero or a mid-sentence-truncated budget
        // for the actual visible answer, which silently produced an empty/garbled
        // reply even though the call "succeeds" — see the retry in askMrKim below.
        options: { temperature: 0.5, num_predict: options?.maxTokens ?? 600 },
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content: string | undefined = data?.message?.content;
    if (!content) return null;

    // Defensive strip in case a future model/version inlines <think> tags into content.
    return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Calls the local Ollama server ("Mr. Kim"'s brain). Returns null (instead of
 * throwing) if Ollama isn't running or the model isn't pulled, so callers can
 * fall back to static content and the app keeps working without Ollama.
 *
 * Retries once on an empty result: since sampling temperature > 0, the
 * model's internal "thinking" length before qwen3 (a hybrid thinking model)
 * gets around to the visible answer varies from call to call — occasionally
 * it runs long enough to consume the entire token budget, leaving nothing
 * for the answer. A fresh call gets a fresh (usually shorter) thinking pass,
 * which in practice resolves this far more reliably than just raising the
 * token budget for every call would.
 */
export async function askMrKim(
  messages: OllamaChatMessage[],
  options?: { timeoutMs?: number; maxTokens?: number; signal?: AbortSignal }
): Promise<string | null> {
  const first = await callOllamaOnce(messages, options);
  if (first) return first;
  if (options?.signal?.aborted) return null;
  return callOllamaOnce(messages, options);
}

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Runs a single-turn Mr. Kim prompt and returns JSON ({text, source}), used by
 * every non-chat Mr. Kim surface (lesson coach, history explain, goal-check,
 * round messages, ...).
 *
 * NOTE: this used to stream the reply via a ReadableStream Response (Next's
 * own documented pattern for Route Handlers) to show tokens as they arrive.
 * In this dev environment (Next.js 16.2.10 + Turbopack on Windows) that
 * reliably hung forever — verified with curl, a raw Node fetch reader, and a
 * real browser tab: response headers/body never reached the client even
 * though the identical request completes fine when hitting Ollama directly.
 * Falling back to a plain awaited JSON response, which does work reliably.
 */
export async function getMrKimReply(
  userPrompt: string,
  fallback: string,
  options?: { maxTokens?: number; signal?: AbortSignal }
): Promise<{ text: string; source: "ollama" | "fallback" }> {
  const reply = await askMrKim(
    [
      { role: "system", content: MR_KIM_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    options
  );
  return reply ? { text: reply, source: "ollama" } : { text: fallback, source: "fallback" };
}

export const MR_KIM_SYSTEM_PROMPT = `You are Mr. Kim, an encouraging, knowledgeable ACT tutor AI inside a study app called "ACT Tutor." You help a student prepare for the ACT by explaining concepts clearly, giving supportive but honest feedback, and tailoring explanations to the specific question type and the student's known strengths/weaknesses.

Respond with ONLY the direct answer to the student, written as if speaking straight to them. Never narrate your own reasoning, never restate or summarize the student's context/stats back at them, and never write meta-commentary like "the user wants..." or "I should...". Keep it short: 2-4 sentences unless asked for more detail. Be warm but get straight to the point.`;
