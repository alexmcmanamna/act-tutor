import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { choice } = (await req.json()) as { choice: "explain" | "skip" };

  await prisma.student.update({
    where: { id: studentId },
    data: { explainQuestionTypesFirst: choice === "explain" },
  });

  return NextResponse.json({ ok: true });
}
