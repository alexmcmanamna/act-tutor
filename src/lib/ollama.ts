const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen3:4b";

interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Calls the local Ollama server ("Mr. Kim"'s brain). Returns null (instead of
 * throwing) if Ollama isn't running or the model isn't pulled, so callers can
 * fall back to static content and the app keeps working without Ollama.
 */
export async function askMrKim(
  messages: OllamaChatMessage[],
  options?: { timeoutMs?: number; maxTokens?: number }
): Promise<string | null> {
  const controller = new AbortController();
  // Local CPU inference is slow on this hardware (no GPU, ~3 tokens/sec); give it
  // plenty of room before falling back to static content.
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 170000);

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
        // answer combined, and this model's reasoning pass alone can run 150+ tokens.
        // Too low a cap silently produces an empty answer even though the call "succeeds".
        options: { temperature: 0.5, num_predict: options?.maxTokens ?? 400 },
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
 * Streaming variant of askMrKim: returns a ReadableStream of raw text chunks
 * (the assistant's reply, as it's generated) instead of waiting for the full
 * response. This is the main lever for perceived latency on this local
 * CPU-only setup — the student sees the first words in seconds instead of
 * waiting the full (possibly 60-170s) generation time. Returns null if Ollama
 * isn't reachable, so callers can fall back to a static message.
 */
export async function askMrKimStream(
  messages: OllamaChatMessage[],
  options?: { timeoutMs?: number; maxTokens?: number }
): Promise<ReadableStream<Uint8Array> | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 170000);

  let res: Response;
  try {
    res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: true,
        // With think:true, each streamed chunk's message.content already
        // excludes reasoning (which streams separately in message.thinking),
        // so no <think> stripping is needed here.
        think: true,
        options: { temperature: 0.5, num_predict: options?.maxTokens ?? 400 },
      }),
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timeout);
    return null;
  }

  if (!res.ok || !res.body) {
    clearTimeout(timeout);
    return null;
  }

  // Ollama's streaming response is newline-delimited JSON, one object per
  // token/chunk: {"message":{"role":"assistant","content":"..."},"done":false}
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(streamController) {
      const { done, value } = await reader.read();
      if (done) {
        clearTimeout(timeout);
        streamController.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const content: string | undefined = parsed?.message?.content;
          if (content) streamController.enqueue(encoder.encode(content));
        } catch {
          // Ignore malformed/partial line.
        }
      }
    },
    cancel() {
      clearTimeout(timeout);
      reader.cancel();
    },
  });
}

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export const MR_KIM_SYSTEM_PROMPT = `You are Mr. Kim, an encouraging, knowledgeable ACT tutor AI inside a study app called "ACT Tutor." You help a student prepare for the ACT by explaining concepts clearly, giving supportive but honest feedback, and tailoring explanations to the specific question type and the student's known strengths/weaknesses.

Respond with ONLY the direct answer to the student, written as if speaking straight to them. Never narrate your own reasoning, never restate or summarize the student's context/stats back at them, and never write meta-commentary like "the user wants..." or "I should...". Keep it short: 2-4 sentences unless asked for more detail. Be warm but get straight to the point.`;
