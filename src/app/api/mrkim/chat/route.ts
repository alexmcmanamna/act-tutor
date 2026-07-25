import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { askMrKimStream, MR_KIM_SYSTEM_PROMPT } from "@/lib/ollama";
import { buildMasteryTable } from "@/lib/studyPlan";
import { sectionLabel, subtopicLabel } from "@/data/subtopics";

const UNREACHABLE_FALLBACK =
  "I can't reach my local Ollama brain right now (make sure `ollama serve` is running and the model is pulled), but here's a quick tip: focus your next practice session on your lowest-mastery subtopic on the dashboard — that's where you'll gain the most points.";

const SLOW_RESPONSE_FALLBACK =
  "Sorry, that one took me too long to think through! Try asking again, or make your question a bit more specific — that's often faster for me to answer.";

interface ChatBody {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const { message, history } = (await req.json()) as ChatBody;
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  const masteryTable = await buildMasteryTable(student);
  const weakest = [...masteryTable].sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  const weakList = weakest
    .map((w) => `${subtopicLabel(w.section, w.subtopic)} (${sectionLabel(w.section)}, ~${Math.round(w.mastery * 100)}% mastery)`)
    .join(", ");

  const contextPrompt = `Student context: goal score ${student.goalScore}, current baseline ${
    student.currentScore ?? "unknown"
  }, weakest tracked areas: ${weakList || "none yet"}. Use this only if relevant to the question.`;

  const stream = await askMrKimStream(
    [
      { role: "system", content: `${MR_KIM_SYSTEM_PROMPT}\n\n${contextPrompt}` },
      ...(history ?? []),
      { role: "user", content: message },
    ],
    // A bit more headroom than the default: this model's internal "thinking"
    // pass (hidden from the user) can otherwise eat the whole token budget on
    // a system-prompt-heavy chat turn, leaving zero tokens for the visible
    // answer even though the call "succeeds".
    { maxTokens: 700 }
  );

  if (!stream) {
    return new Response(UNREACHABLE_FALLBACK, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Mr-Kim-Source": "fallback" },
    });
  }

  return new Response(withEmptyStreamFallback(stream, SLOW_RESPONSE_FALLBACK), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Mr-Kim-Source": "ollama" },
  });
}

/** If the upstream stream closes having emitted zero bytes (e.g. the model spent its whole budget "thinking" with nothing left for a visible answer), fall back to a static message instead of leaving the client with a permanently empty reply. */
function withEmptyStreamFallback(source: ReadableStream<Uint8Array>, fallback: string): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  let sawBytes = false;
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      let result: ReadableStreamReadResult<Uint8Array>;
      try {
        result = await reader.read();
      } catch {
        // Upstream errored or was aborted (e.g. the model took too long to
        // even start answering) — degrade to the fallback text instead of
        // erroring the response out from under the client mid-stream.
        if (!sawBytes) controller.enqueue(encoder.encode(fallback));
        controller.close();
        return;
      }
      if (result.done) {
        if (!sawBytes) controller.enqueue(encoder.encode(fallback));
        controller.close();
        return;
      }
      if (result.value.length > 0) sawBytes = true;
      controller.enqueue(result.value);
    },
    cancel(reason) {
      reader.cancel(reason);
    },
  });
}
