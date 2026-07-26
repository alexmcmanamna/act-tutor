import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { generateRoundFollowUpMessage } from "@/lib/mrKimMessages";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const { previousComposite, newComposite, roundNumber } = (await req.json()) as {
    previousComposite: number | null;
    newComposite: number | null;
    roundNumber: number;
  };

  const { text } = await generateRoundFollowUpMessage(student, previousComposite, newComposite, roundNumber);

  await prisma.student.update({ where: { id: studentId }, data: { roundFollowUpPending: false } });

  return NextResponse.json({ text });
}
