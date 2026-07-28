import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { askMrKim, MR_KIM_SYSTEM_PROMPT } from "@/lib/ollama";
import { buildMasteryTable } from "@/lib/studyPlan";
import { sectionLabel, subtopicLabel } from "@/data/subtopics";

const UNREACHABLE_FALLBACK =
  "I can't quite think right now — try asking again in a moment, or focus your next practice session on your lowest-mastery subtopic on the dashboard.";

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

  const reply = await askMrKim(
    [
      { role: "system", content: `${MR_KIM_SYSTEM_PROMPT}\n\n${contextPrompt}` },
      ...(history ?? []),
      { role: "user", content: message },
    ],
    // A bit more headroom than the default: this model's internal "thinking"
    // pass (hidden from the user) can otherwise eat the whole token budget on
    // a system-prompt-heavy chat turn, leaving zero tokens for the visible
    // answer even though the call "succeeds".
    { maxTokens: 700, signal: req.signal }
  );

  return NextResponse.json({ reply: reply ?? UNREACHABLE_FALLBACK, source: reply ? "ollama" : "fallback" });
}
